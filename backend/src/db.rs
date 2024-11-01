use diesel::prelude::*;
use crate::models::{Todo};
use crate::schema::todos::dsl::*;
use diesel::pg::PgConnection;

pub fn create_todo(
    conn: &PgConnection,
    title_text: String,
) -> QueryResult<Todo> {
    let new_todo = Todo { id: 0, title: title_text, completed: false };
    diesel::insert_into(todos)
        .values(&new_todo)
        .get_result(conn)
}
