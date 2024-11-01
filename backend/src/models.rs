use super::schema::todos;
use serde::{Serialize, Deserialize};

#[derive(Queryable, Insertable, Serialize, Deserialize)]
#[table_name = "todos"]
pub struct Todo {
    pub id: i32,
    pub title: String,
    pub completed: bool,
}
