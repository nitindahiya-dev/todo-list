use actix_web::{get, post, web, App, HttpServer, Responder, HttpResponse};
use actix_cors::Cors;
use std::sync::Mutex;
mod addtodo;
mod removetodo;
mod edittodo;

use addtodo::{AppState, TodoList};
use removetodo::remove_todo;
use edittodo::edit_todo;

#[get("/todos")]
async fn get_todos(data: web::Data<AppState>) -> impl Responder {
    let todo_list = data.todo_list.lock().unwrap();
    HttpResponse::Ok().json(todo_list.get_todos())
}

#[post("/add_todo")]
async fn add_todo(
    data: web::Data<AppState>,
    todo: web::Json<String>,
) -> impl Responder {
    let mut todo_list = data.todo_list.lock().unwrap();
    todo_list.add_todo(todo.into_inner());
    HttpResponse::Ok().body("Todo added")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let app_state = web::Data::new(AppState {
        todo_list: Mutex::new(TodoList::new()),
    });

    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allowed_methods(vec!["GET", "POST", "DELETE", "PUT"])
                    .allowed_headers(vec!["Content-Type"]),
            )
            .service(get_todos)
            .service(add_todo)
            .service(remove_todo)
            .service(edit_todo)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
