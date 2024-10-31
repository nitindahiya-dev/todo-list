// src/todo.rs
pub struct TodoList {
    pub todos: Vec<String>,
}

impl TodoList {
    pub fn new() -> Self {
        Self { todos: Vec::new() }
    }

    pub fn add_todo(&mut self, todo: String) {
        self.todos.push(todo);
    }

    pub fn get_todos(&self) -> &Vec<String> {
        &self.todos
    }
}
