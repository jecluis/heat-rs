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
    pub datetime: i64,
    pub exercise: String,
    pub calories: u32,
    pub duration_sec: i64,
    #[allow(dead_code)]
    pub added_at: i64,
}

#[derive(serde::Serialize)]
pub struct JournalExercise {
    pub datetime: chrono::DateTime<chrono::Utc>,
    pub exercise: String,
    pub calories: u32,
    pub duration: i64,
}

pub async fn journal(
    db: &DB,
    datetime: &chrono::DateTime<chrono::Utc>,
    exercise: &String,
    calories: &u32,
    duration: &i64,
) -> Result<(), HeatError> {
    log::debug!(
        "Log exercise on {} type {} for {} minutes with {} kcal expended.",
        &datetime,
        &exercise,
        &calories,
        &duration
    );

    if !duration.is_positive() {
        log::error!("Exercise duration is not positive: {}", &duration);
        return Err(HeatError::InvalidParametersError);
    }

    let mut tx = db.pool().begin().await.unwrap_or_else(|err| {
        panic!("Unable to start transaction: {}", err);
    });
    let exercise_id = match sqlx::query_scalar::<_, i64>("SELECT id FROM exercises WHERE name = ?")
        .bind(&exercise)
        .fetch_one(&mut *tx)
        .await
    {
        Ok(v) => v,
        Err(sqlx::Error::RowNotFound) => {
            log::error!("Unknown exercise type '{}'!", &exercise);
            return Err(HeatError::UnknownExerciseError);
        }
        Err(err) => {
            log::error!(
                "Unknown error obtaining exercise ID for '{}': {}",
                &exercise,
                err
            );
            return Err(HeatError::GenericError);
        }
    };

    let duration_sec = duration * 60;

    match sqlx::query(
        "
        INSERT INTO log_exercise (datetime, exercise_id, calories, duration_sec, added_at)
        VALUES (?, ?, ?, ?, ?)
        ",
    )
    .bind(&datetime.timestamp())
    .bind(&exercise_id)
    .bind(&calories)
    .bind(&duration_sec)
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
        SELECT datetime, exercises.name as exercise, calories, duration_sec, added_at
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
            datetime: dt,
            exercise: entry.exercise,
            calories: entry.calories,
            duration: duration_min,
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
