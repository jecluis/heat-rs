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

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use journal::exercise::JournalExerciseParams;
use log::{debug, error};

mod db;
mod errors;
mod journal;
mod paths;
mod state;

struct ManagedState {
    state: tokio::sync::Mutex<state::State>,
}

impl ManagedState {
    pub async fn state(self: &Self) -> tokio::sync::MutexGuard<'_, state::State> {
        self.state.lock().await
    }
}

#[tauri::command]
async fn journal_weight(
    date: chrono::DateTime<chrono::Utc>,
    value: f32,
    mstate: tauri::State<'_, ManagedState>,
) -> Result<bool, ()> {
    debug!("Logging weight at {} value {}", date, value);
    let state = &mstate.state().await;
    let db = &state.db;

    match journal::weight::journal(&db, &date, &value).await {
        Ok(()) => {}
        Err(err) => {
            error!("error journaling weight: {}", err);
            return Err(());
        }
    };

    Ok(true)
}

#[tauri::command]
async fn get_weight_journal(
    mstate: tauri::State<'_, ManagedState>,
) -> Result<Vec<journal::weight::JournalWeight>, ()> {
    let state = &mstate.state().await;
    let db = &state.db;

    match journal::weight::get_entries(&db).await {
        Err(err) => {
            log::error!("Unable to obtain weight journal: {}", err);
            return Err(());
        }
        Ok(v) => Ok(v),
    }
}

#[tauri::command]
async fn delete_weight_journal_entry(
    date: chrono::NaiveDate,
    mstate: tauri::State<'_, ManagedState>,
) -> Result<bool, ()> {
    let state = &mstate.state().await;
    let db = &state.db;

    match journal::weight::delete_entry(&db, &date).await {
        Err(err) => {
            log::error!("Unable to delete weight journal entry: {}", err);
            return Err(());
        }
        Ok(v) => Ok(v),
    }
}

#[tauri::command]
async fn journal_exercise(
    params: JournalExerciseParams,
    mstate: tauri::State<'_, ManagedState>,
) -> Result<bool, ()> {
    let state = &mstate.state().await;
    let db = &state.db;

    match journal::exercise::journal(&db, &params).await {
        Ok(_) => Ok(true),
        Err(_) => Err(()),
    }
}

#[tauri::command]
async fn get_exercise_journal(
    mstate: tauri::State<'_, ManagedState>,
) -> Result<Vec<journal::exercise::JournalExercise>, ()> {
    let state = &mstate.state().await;
    let db = &state.db;

    match journal::exercise::get_entries(&db).await {
        Ok(v) => Ok(v),
        Err(err) => {
            log::error!("Unable to obtain exercise journal: {}", err);
            return Err(());
        }
    }
}

#[tauri::command]
async fn delete_exercise_journal_entry(
    id: i64,
    mstate: tauri::State<'_, ManagedState>,
) -> Result<bool, ()> {
    let state = &mstate.state().await;
    let db = &state.db;

    match journal::exercise::delete_entry(&db, &id).await {
        Ok(v) => Ok(v),
        Err(err) => {
            log::error!("Unable to delete exercise journal entry: {}", err);
            return Err(());
        }
    }
}

#[tauri::command]
async fn get_exercise_types(mstate: tauri::State<'_, ManagedState>) -> Result<Vec<String>, ()> {
    let state = &mstate.state().await;
    let db = &state.db;
    match journal::exercise::get_exercise_types(&db).await {
        Ok(res) => Ok(res),
        Err(_) => Err(()),
    }
}

#[tauri::command]
async fn get_paths(mstate: tauri::State<'_, ManagedState>) -> Result<paths::Paths, ()> {
    let state = &mstate.state().await;
    Ok(state.paths.clone())
}

async fn setup_db(path: &std::path::PathBuf) -> db::DB {
    let mut handle = db::DB::new(&path).setup().await;
    handle.connect().await;

    handle
}

#[tokio::main]
async fn main() {
    env_logger::init();
    let paths = match std::env::var("HEAT_BASE_DIR") {
        Ok(basedir) => {
            paths::Paths::new(&std::path::PathBuf::from(&basedir))
                .init()
                .await
        }
        Err(_) => paths::Paths::default().init().await,
    };
    let db_handle = setup_db(&paths.db_path).await;

    tauri::async_runtime::set(tokio::runtime::Handle::current());

    tauri::Builder::default()
        .manage(ManagedState {
            state: tokio::sync::Mutex::new(state::State {
                db: db_handle,
                paths,
            }),
        })
        .invoke_handler(tauri::generate_handler![
            journal_weight,
            get_weight_journal,
            delete_weight_journal_entry,
            journal_exercise,
            get_exercise_journal,
            delete_exercise_journal_entry,
            get_exercise_types,
            get_paths,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
