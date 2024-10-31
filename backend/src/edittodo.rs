use actix_web::{put, web, HttpResponse, Responder};
use crate::addtodo::AppState;

#[put("/edit_todo")]
async fn edit_todo(
    data: web::Data<AppState>,
    params: web::Json<(usize, String)>, // expects (index, new_todo)
) -> impl Responder {
    let (index, new_todo) = params.into_inner();

    // Lock and access the todo_list
    let mut todo_list = data.todo_list.lock().unwrap();

    // Use the edit_todo method to modify the todo at the specified index
    match todo_list.edit_todo(index, new_todo) {
        Ok(()) => HttpResponse::Ok().body("Todo updated"),
        Err(err) => HttpResponse::BadRequest().body(err), // Return an error if index is invalid
    }
}
