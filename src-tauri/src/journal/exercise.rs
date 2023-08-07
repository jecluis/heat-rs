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

use crate::{db::DB, errors::HeatError};

#[derive(sqlx::FromRow)]
struct TableExerciseEntry {
    pub id: u64,
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
    pub duration: u64,
}

pub async fn journal(
    db: &DB,
    datetime: &chrono::DateTime<chrono::Utc>,
    calories: &u32,
    duration: &u64,
) -> Result<(), HeatError> {
    Ok(())
}

pub async fn get_entries(db: &DB) -> Result<Vec<JournalExercise>, HeatError> {
    let entries: Vec<JournalExercise> = vec![];

    Ok(entries)
}

pub async fn get_exercise_types(db: &DB) -> Result<Vec<String>, HeatError> {
    match sqlx::query_scalar::<_, String>("SELECT name FROM exercises")
        .fetch_all(db.pool())
        .await
    {
        Ok(res) => Ok(res),
        Err(err) => {
            log::error!("Error fetching exercises: {}", err);
            return Err(HeatError::Generic);
        }
    }
}
