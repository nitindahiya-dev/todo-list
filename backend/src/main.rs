// src/main.rs
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use actix_cors::Cors; // Import the Cors module
use std::sync::Mutex;
mod addtodo;
use addtodo::TodoList;

struct AppState {
    todo_list: Mutex<TodoList>,
}

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
                    .allow_any_origin() // Allow any origin (for development)
                    .allowed_methods(vec!["GET", "POST"]) // Allow GET and POST methods
                    .allowed_headers(vec!["Content-Type"]), // Allow Content-Type header
            )
            .service(get_todos)
            .service(add_todo)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
