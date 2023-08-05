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

use log::{debug, info};
use sqlx::{migrate::MigrateDatabase, SqlitePool};

use crate::errors::HeatError;

/// Current database schema version
///
/// version 1: initial format
///
const HEAT_DB_VERSION: u32 = 1;

pub struct DB {
    pub uri: String,
    pub pool: Option<SqlitePool>,
}

impl DB {
    pub fn new(path: &std::path::PathBuf) -> DB {
        let uri = format!("sqlite://{}", path.display());

        DB { uri, pool: None }
    }

    pub async fn connect(self: &mut Self) {
        if self.pool.is_some() {
            panic!("Attempting to connect to connected database!");
        }

        self.pool = Some(SqlitePool::connect(&self.uri).await.unwrap_or_else(|_| {
            panic!("Unable to open database!");
        }));
    }

    pub async fn setup(self: Self) -> Self {
        if !sqlx::Sqlite::database_exists(&self.uri)
            .await
            .unwrap_or(false)
        {
            sqlx::Sqlite::create_database(&self.uri).await.unwrap();
            match create_db_schema(&self.uri).await {
                Ok(()) => info!("Database created successfully!"),
                Err(err) => panic!("{}", err),
            };
        } else {
            debug!("Database exists, maybe migrate?");
            match maybe_migrate(&self.uri).await {
                Ok(()) => {}
                Err(err) => {
                    panic!("Error migrating database: {}", err);
                }
            };
        }

        self
    }

    pub fn pool(self: &Self) -> &SqlitePool {
        match &self.pool {
            Some(pool) => pool,
            None => {
                panic!("Trying to obtain pool for unconnected database!");
            }
        }
    }
}

async fn create_db_schema(uri: &str) -> Result<(), sqlx::Error> {
    let pool = SqlitePool::connect(uri).await?;
    let mut tx = pool.begin().await?;
    let query = "
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS log_weight (
        date        INTEGER PRIMARY KEY NOT NULL,
        value       REAL NOT NULL,
        added_at    INTEGER NOT NULL
    );
    ";

    match sqlx::query(&query).execute(&mut *tx).await {
        Ok(_) => {}
        Err(err) => {
            panic!("Unable to create database: {}", err);
        }
    };

    match sqlx::query(format!("PRAGMA user_version = {}", HEAT_DB_VERSION).as_str())
        .execute(&mut *tx)
        .await
    {
        Ok(_) => {}
        Err(err) => {
            panic!("Unable to set database version: {}", err);
        }
    };

    match tx.commit().await {
        Ok(_) => {}
        Err(err) => {
            panic!("Unable to commit initial transaction: {}", err);
        }
    };

    pool.close().await;
    Ok(())
}

async fn maybe_migrate(uri: &str) -> Result<(), HeatError> {
    let pool = SqlitePool::connect(uri).await.unwrap_or_else(|err| {
        panic!("Unable to connect to database at '{}': {}", uri, err);
    });

    let version = match sqlx::query_scalar::<_, u32>("SELECT user_version FROM pragma_user_version")
        .fetch_one(&pool)
        .await
    {
        Ok(v) => v,
        Err(err) => {
            panic!("Unable to obtain database version: {}", err);
        }
    };
    debug!(
        "Database at version {}, latest {}",
        version, HEAT_DB_VERSION
    );

    if version > HEAT_DB_VERSION {
        return Err(HeatError::DBInFutureError);
    } else if version < HEAT_DB_VERSION {
        // migrate
        let mut v = version;
        while v < HEAT_DB_VERSION {
            let to = v + 1;
            info!("Migrate database from version {} to {}", v, to);
            match migrate(&pool, v, to).await {
                Ok(()) => {}
                Err(err) => {
                    panic!(
                        "Error migrating database from version {} to {}: {}",
                        v, to, err
                    );
                }
            };
            v = v + 1;
        }
    }

    Ok(())
}

async fn migrate(_pool: &sqlx::Pool<sqlx::Sqlite>, from: u32, to: u32) -> Result<(), sqlx::Error> {
    if from < to - 1 {
        panic!("Can't migrate database versions separated by more than one version!");
    } else if from > to {
        panic!("Can't migrate database from the future!");
    } else if from == to {
        // nothing to do
        return Ok(());
    }

    Ok(())
}
