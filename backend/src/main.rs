use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use actix_cors::Cors;
use serde::{Serialize, Deserialize};
use uuid::Uuid;
use std::sync::Mutex;
use chrono::{DateTime, Utc};
use mongodb::{Client, options::ClientOptions, bson::doc};
use dotenv::dotenv;
use std::env;

#[derive(Serialize, Deserialize, Clone)]
struct TodoItem {
    id: Uuid,
    title: String,
    completed: bool,
    created_at: DateTime<Utc>,
}

#[derive(Deserialize)]
struct CreateTodoItem {
    title: String,
    completed: bool,
}

#[derive(Deserialize)]
struct UpdateTodoItem {
    title: Option<String>,
    completed: Option<bool>,
}

struct AppState {
    todo_list: Mutex<Vec<TodoItem>>,
}

async fn get_todos(data: web::Data<AppState>) -> impl Responder {
    let todos = data.todo_list.lock().unwrap();
    HttpResponse::Ok().json(&*todos)
}

async fn add_todo(
    item: web::Json<CreateTodoItem>,
    data: web::Data<AppState>,
) -> impl Responder {
    let mut todos = data.todo_list.lock().unwrap();
    let new_todo = TodoItem {
        id: Uuid::new_v4(),
        title: item.title.clone(),
        completed: item.completed,
        created_at: Utc::now(),
    };
    todos.push(new_todo);
    HttpResponse::Ok().json(&*todos)
}

async fn update_todo(
    path: web::Path<Uuid>,
    item: web::Json<UpdateTodoItem>,
    data: web::Data<AppState>,
) -> impl Responder {
    let mut todos = data.todo_list.lock().unwrap();

    if let Some(todo) = todos.iter_mut().find(|todo| todo.id == *path) {
        if let Some(title) = item.title.clone() {
            todo.title = title;
        }

        if let Some(completed) = item.completed {
            todo.completed = completed;
        }
        HttpResponse::Ok().json(&*todos)
    } else {
        HttpResponse::NotFound().body("Item not found")
    }
}

async fn delete_todo(
    path: web::Path<Uuid>,
    data: web::Data<AppState>,
) -> impl Responder {
    let mut todos = data.todo_list.lock().unwrap();
    if todos.iter().any(|todo| todo.id == *path) {
        todos.retain(|todo| todo.id != *path);
        HttpResponse::Ok().json(&*todos)
    } else {
        HttpResponse::NotFound().body("Item not found")
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let client_options = ClientOptions::parse(&database_url).await.unwrap();
    let client = Client::with_options(client_options).unwrap();
    let database = client.database("todo_app");
    let _collection = database.collection::<TodoItem>("todos");

    match client.list_database_names(None, None).await {
        Ok(_) => println!("Database connected"),
        Err(e) => {
            eprintln!("Failed to connect to the database: {}", e);
            std::process::exit(1);
        }
    }

    let app_state = web::Data::new(AppState {
        todo_list: Mutex::new(Vec::new()), 
    });

    let port = 8080;
    println!("Server Started and Running on Port {}", port);

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .app_data(app_state.clone())
            .wrap(cors)
            .route("/todos", web::get().to(get_todos))
            .route("/todos", web::post().to(add_todo))
            .route("/todos/{id}", web::put().to(update_todo))
            .route("/todos/{id}", web::delete().to(delete_todo))
    })
    .bind(("127.0.0.1", port))?
    .run()
    .await
}