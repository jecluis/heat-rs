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

use std::fmt::Display;

#[derive(Debug, Copy, Clone)]
pub enum HeatError {
    DBInFutureError,
    ExistsError,
    UnknownExerciseError,
    InvalidParametersError,
    GenericError,
}

impl Display for HeatError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let msg = match self {
            HeatError::DBInFutureError => "database is in the future",
            HeatError::ExistsError => "already exists",
            HeatError::UnknownExerciseError => "unknown exercise",
            HeatError::InvalidParametersError => "invalid parameters",
            HeatError::GenericError => "generic error",
        };

        f.write_str(msg)
    }
}
