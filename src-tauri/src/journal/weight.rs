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
use chrono::TimeZone;

#[derive(sqlx::FromRow)]
struct TableWeightEntry {
    pub date: i64,
    pub value: f32,
    #[allow(dead_code)]
    pub added_at: i64,
}

#[derive(serde::Serialize)]
pub struct JournalWeight {
    pub date: chrono::NaiveDate,
    pub value: f32,
}

fn date_to_ts(date: &chrono::DateTime<chrono::Utc>) -> i64 {
    date.date_naive().and_hms_opt(0, 0, 0).unwrap().timestamp()
}

pub async fn journal(
    db: &DB,
    date: &chrono::DateTime<chrono::Utc>,
    value: &f32,
) -> Result<(), HeatError> {
    log::debug!("journal weight: date = {}, value = {}", date, value);

    let date_ts = date_to_ts(&date);

    match has_entry(&db, &date_ts).await {
        Err(err) => {
            log::error!("Unable to journal: {}", err);
            return Err(err);
        }
        Ok(true) => {
            log::info!("Entry for date '{}' already exists!", date);
            return Err(HeatError::ExistsError);
        }
        Ok(false) => {}
    };

    let now = chrono::Utc::now().timestamp();

    match sqlx::query("INSERT INTO log_weight (date, value, added_at) VALUES (?, ?, ?)")
        .bind(&date_ts)
        .bind(&value)
        .bind(&now)
        .execute(db.pool())
        .await
    {
        Ok(_) => {}
        Err(err) => {
            log::error!("Error inserting weight entry to database: {}", err);
            return Err(HeatError::GenericError);
        }
    };

    Ok(())
}

pub async fn has_entry(db: &DB, date_ts: &i64) -> Result<bool, HeatError> {
    match sqlx::query_scalar::<_, u32>("SELECT count(date) FROM log_weight WHERE date = ?")
        .bind(&date_ts)
        .fetch_one(db.pool())
        .await
    {
        Ok(v) => Ok(v > 0),
        Err(err) => {
            log::error!("Error counting entries for date '{}': {}", date_ts, err);
            return Err(HeatError::GenericError);
        }
    }
}

pub async fn get_entries(db: &DB) -> Result<Vec<JournalWeight>, HeatError> {
    let entries =
        match sqlx::query_as::<_, TableWeightEntry>("SELECT date, value, added_at FROM log_weight")
            .fetch_all(db.pool())
            .await
        {
            Ok(res) => res,
            Err(err) => {
                log::error!("Error fetching entries: {}", err);
                return Err(HeatError::GenericError);
            }
        };

    let mut result: Vec<JournalWeight> = vec![];
    for entry in entries {
        let dt = chrono::Utc.timestamp_opt(entry.date, 0).unwrap();
        result.push(JournalWeight {
            date: dt.date_naive(),
            value: entry.value,
        });
    }

    Ok(result)
}
