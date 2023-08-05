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

use std::str::FromStr;

use crate::{db::DB, errors::HeatError};

fn date_str_to_ts(date: &String) -> i64 {
    chrono::NaiveDate::from_str(&date)
        .unwrap()
        .and_hms_opt(0, 0, 0)
        .unwrap()
        .timestamp()
}

pub async fn journal(db: &DB, date: &String, value: &f32) -> Result<(), HeatError> {
    log::debug!("journal weight: date = {}, value = {}", date, value);

    let date_ts = date_str_to_ts(&date);

    match has_entry(&db, &date).await {
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
            return Err(HeatError::Generic);
        }
    };

    Ok(())
}

pub async fn has_entry(db: &DB, date: &String) -> Result<bool, HeatError> {
    let date_ts = date_str_to_ts(&date);

    match sqlx::query_scalar::<_, u32>("SELECT count(date) FROM log_weight WHERE date = ?")
        .bind(&date_ts)
        .fetch_one(db.pool())
        .await
    {
        Ok(v) => Ok(v > 0),
        Err(err) => {
            log::error!("Error counting entries for date '{}': {}", date, err);
            return Err(HeatError::Generic);
        }
    }
}
