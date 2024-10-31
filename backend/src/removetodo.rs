// src/removetodo.rs
use actix_web::{delete, web, HttpResponse, Responder};

use crate::addtodo::AppState; // Import AppState and TodoList

#[delete("/remove_todo")]
pub async fn remove_todo(
    data: web::Data<AppState>,
    todo: web::Json<String>,
) -> impl Responder {
    let mut todo_list = data.todo_list.lock().unwrap();
    let success = todo_list.remove_todo(&todo.into_inner());
    if success {
        HttpResponse::Ok().body("Todo removed")
    } else {
        HttpResponse::NotFound().body("Todo not found")
    }
}
