// Copyright 2023 Joao Eduardo Luis <joao@abysmo.io>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

use chrono::TimeZone;

use crate::{db::DB, errors::HeatError};

#[derive(sqlx::FromRow)]
struct TableExerciseEntry {
    pub id: i64,
    pub datetime: i64,
    pub exercise: String,
    pub calories: u32,
    pub duration_sec: i64,
    pub bpm_max: u32,
    pub bpm_avg: u32,
    #[allow(dead_code)]
    pub added_at: i64,
}

#[derive(serde::Serialize)]
pub struct JournalExerciseBPM {
    pub max: u32,
    pub avg: u32,
}

#[derive(serde::Serialize)]
pub struct JournalExercise {
    pub id: i64,
    pub datetime: chrono::DateTime<chrono::Utc>,
    pub exercise: String,
    pub calories: u32,
    pub duration: i64,
    pub bpm: JournalExerciseBPM,
}

#[derive(serde::Deserialize)]
pub struct JournalExerciseParamsDuration {
    pub total: i64,
    pub light: i64,
    pub intense: i64,
    pub aerobic: i64,
    pub anaerobic: i64,
}

#[derive(serde::Deserialize)]
pub struct JournalExerciseParamsBPM {
    pub max: u32,
    pub avg: u32,
}

#[derive(serde::Deserialize)]
pub struct JournalExerciseParamsWhat {
    pub strokes: u32,
    pub steps: u32,
}

#[derive(serde::Deserialize)]
pub struct JournalExerciseParams {
    pub when: chrono::DateTime<chrono::Utc>,
    #[serde(rename(deserialize = "type"))]
    pub exercise: String,
    pub calories: u32,
    pub duration: JournalExerciseParamsDuration,
    pub bpm: JournalExerciseParamsBPM,
    pub distance: u32,
    pub what: JournalExerciseParamsWhat,
}

pub async fn journal(db: &DB, params: &JournalExerciseParams) -> Result<(), HeatError> {
    log::debug!(
        "Log exercise on {} type {} for {} minutes with {} kcal expended.",
        &params.when,
        &params.exercise,
        &params.calories,
        &params.duration.total
    );

    if !params.duration.total.is_positive() {
        log::error!(
            "Exercise duration is not positive: {}",
            &params.duration.total
        );
        return Err(HeatError::InvalidParametersError);
    }

    let mut tx = db.pool().begin().await.unwrap_or_else(|err| {
        panic!("Unable to start transaction: {}", err);
    });
    let exercise_id = match sqlx::query_scalar::<_, u32>("SELECT id FROM exercises WHERE name = ?")
        .bind(&params.exercise)
        .fetch_one(&mut *tx)
        .await
    {
        Ok(v) => v,
        Err(sqlx::Error::RowNotFound) => {
            log::error!("Unknown exercise type '{}'!", &params.exercise);
            return Err(HeatError::UnknownExerciseError);
        }
        Err(err) => {
            log::error!(
                "Unknown error obtaining exercise ID for '{}': {}",
                &params.exercise,
                err
            );
            return Err(HeatError::GenericError);
        }
    };

    let duration_sec = params.duration.total * 60;
    let duration_light_sec = params.duration.light * 60;
    let duration_intense_sec = params.duration.intense * 60;
    let duration_aerobic_sec = params.duration.aerobic * 60;
    let duration_anaerobic_sec = params.duration.anaerobic * 60;

    match sqlx::query(
        "
        INSERT INTO log_exercise (
            datetime, exercise_id, calories, duration_sec,
            duration_light_sec, duration_intense_sec, duration_aerobic_sec, duration_anaerobic_sec,
            bpm_max, bpm_avg, distance_meters, steps, strokes, added_at
        )
        VALUES (
            ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?
        )
        ",
    )
    .bind(&params.when.timestamp())
    .bind(&exercise_id)
    .bind(&params.calories)
    .bind(&duration_sec)
    .bind(&duration_light_sec)
    .bind(&duration_intense_sec)
    .bind(&duration_aerobic_sec)
    .bind(&duration_anaerobic_sec)
    .bind(&params.bpm.max)
    .bind(&params.bpm.avg)
    .bind(&params.distance)
    .bind(&params.what.steps)
    .bind(&params.what.strokes)
    .bind(chrono::Utc::now().timestamp())
    .execute(&mut *tx)
    .await
    {
        Ok(_) => {}
        Err(err) => {
            log::error!("Unknown error logging exercise: {}", err);
            return Err(HeatError::GenericError);
        }
    };

    match tx.commit().await {
        Ok(()) => Ok(()),
        Err(err) => {
            log::error!("Unknown error commit exercise log transaction: {}", err);
            return Err(HeatError::GenericError);
        }
    }
}

pub async fn get_entries(db: &DB) -> Result<Vec<JournalExercise>, HeatError> {
    let entries: Vec<TableExerciseEntry> = match sqlx::query_as::<_, TableExerciseEntry>(
        "
        SELECT log_exercise.id as id,
            datetime, exercises.name as exercise, calories, duration_sec,
            bpm_max, bpm_avg,
            added_at
        FROM log_exercise INNER JOIN exercises
        ON exercises.id = log_exercise.exercise_id
        ",
    )
    .fetch_all(db.pool())
    .await
    {
        Ok(v) => v,
        Err(err) => {
            log::error!("Error fetching exercise journal entries: {}", err);
            return Err(HeatError::GenericError);
        }
    };

    let mut result: Vec<JournalExercise> = vec![];
    for entry in entries {
        let dt = chrono::Utc.timestamp_opt(entry.datetime, 0).unwrap();
        let duration_min = entry.duration_sec / 60;
        result.push(JournalExercise {
            id: entry.id,
            datetime: dt,
            exercise: entry.exercise,
            calories: entry.calories,
            duration: duration_min,
            bpm: JournalExerciseBPM {
                max: entry.bpm_max,
                avg: entry.bpm_avg,
            },
        });
    }

    Ok(result)
}

pub async fn get_exercise_types(db: &DB) -> Result<Vec<String>, HeatError> {
    match sqlx::query_scalar::<_, String>("SELECT name FROM exercises")
        .fetch_all(db.pool())
        .await
    {
        Ok(res) => Ok(res),
        Err(err) => {
            log::error!("Error fetching exercises: {}", err);
            return Err(HeatError::GenericError);
        }
    }
}
