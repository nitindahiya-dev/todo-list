use std::sync::Mutex;

// Define the TodoList struct
pub struct TodoList {
    pub todos: Vec<String>,
}

impl TodoList {
    // Constructor for TodoList
    pub fn new() -> Self {
        Self { todos: Vec::new() }
    }

    // Method to add a new todo
    pub fn add_todo(&mut self, todo: String) {
        self.todos.push(todo);
    }

    // Method to retrieve todos
    pub fn get_todos(&self) -> &Vec<String> {
        &self.todos
    }

    // Method to remove a todo
    pub fn remove_todo(&mut self, todo: &str) -> bool {
        if let Some(pos) = self.todos.iter().position(|x| x == todo) {
            self.todos.remove(pos);
            true // Successful removal
        } else {
            false // Task not found
        }
    }

    // Method to edit a todo by index
    pub fn edit_todo(&mut self, index: usize, new_todo: String) -> Result<(), &'static str> {
        if index < self.todos.len() {
            self.todos[index] = new_todo;
            Ok(()) // Successful edit
        } else {
            Err("Index out of bounds") // Invalid index
        }
    }
}

// Define AppState to share across files
pub struct AppState {
    pub todo_list: Mutex<TodoList>,
}
