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

use directories::BaseDirs;
use std::path::PathBuf;

const HEAT_PATH_ID: &str = "io.abysmo.heat";

pub struct Paths {
    pub data: PathBuf,
    pub config: PathBuf,
    pub db_path: PathBuf,
}

impl Default for Paths {
    fn default() -> Self {
        let basedirs = BaseDirs::new().expect("unable to obtain base dirs");
        let data = basedirs.data_local_dir().join(HEAT_PATH_ID);
        let config = basedirs.config_local_dir().join(HEAT_PATH_ID);
        let db_path = PathBuf::new().join(&data).join("heat.sqlite3");

        Paths {
            data,
            config,
            db_path,
        }
    }
}

impl Paths {
    pub fn new(basedir: &PathBuf) -> Paths {
        let data = basedir.join("data").join(HEAT_PATH_ID);
        let config = basedir.join("config").join(HEAT_PATH_ID);
        let db_path = data.join("heat.sqlite3");

        Paths {
            data,
            config,
            db_path,
        }
    }

    pub async fn init(self: Paths) -> Paths {
        if !self.data.exists() {
            std::fs::create_dir_all(&self.data).expect("unable to create user data directory");
        }
        if !self.config.exists() {
            std::fs::create_dir_all(&self.config).expect("unable to create user config directory");
        }

        self
    }
}
