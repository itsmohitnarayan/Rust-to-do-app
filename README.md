# Rust-to-do-app

This is a full-stack to-do application built using Rust for the backend and Next.js for the frontend. The application allows users to create, read, update, and delete to-do items.

## Features

- **Create To-Do**: Add new to-do items.
- **Read To-Do**: View all to-do items.
- **Update To-Do**: Edit existing to-do items.
- **Delete To-Do**: Remove to-do items.
- **Search To-Do**: Search for specific to-do items.
- **Toggle Completion**: Mark to-do items as completed or not completed.

## Technologies Used

- **Backend**: Rust, Actix-web, MongoDB
- **Frontend**: Next.js, React, Axios, Date-fns, React-icons

## Project Structure

```
Rust-to-do-app/
├── backend/
│   └── src/
│       └── main.rs
├── frontend/
│   └── pages/
│       └── index.js
│       └── _app.js
│   └── components/
│       └── CheckBox.jsx
│       └── SVG/
│           └── ICON.jsx
├── .env
├── package.json
├── README.md
└── ...
```

## Getting Started

### Prerequisites

- Rust
- Node.js
- MongoDB

### Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/yourusername/rust-to-do-app.git
    cd rust-to-do-app
    ```

2. **Backend Setup**:
    - Navigate to the backend directory:
        ```sh
        cd backend
        ```
    - Create a `.env` file and add your MongoDB connection string:
        ```
        DATABASE_URL=mongodb://localhost:27017/todo_app
        ```
    - Run the backend server:
        ```sh
        cargo run
        ```

3. **Frontend Setup**:
    - Navigate to the frontend directory:
        ```sh
        cd frontend
        ```
    - Install dependencies:
        ```sh
        npm install
        ```
    - Run the frontend server:
        ```sh
        npm run dev
        ```

### Why Rust?

Rust was chosen for the backend of this application for several reasons:

- **Performance**: Rust is known for its high performance and efficiency, making it ideal for backend services that require fast response times.
- **Memory Safety**: Rust's ownership model ensures memory safety without needing a garbage collector, reducing the risk of memory leaks and other bugs.
- **Concurrency**: Rust's concurrency model makes it easier to write safe and efficient concurrent code, which is beneficial for handling multiple requests in a web server.
- **Ecosystem**: Rust has a growing ecosystem with libraries like Actix-web, which provides a powerful and flexible framework for building web applications.

## Usage

- **Add To-Do**: Enter a to-do item in the input field and click "Add".
- **Edit To-Do**: Click the edit icon next to a to-do item, modify the text, and click "Update".
- **Delete To-Do**: Click the delete icon next to a to-do item.
- **Toggle Completion**: Click the checkbox next to a to-do item to mark it as completed or not completed.
- **Search To-Do**: Enter a search term in the search input field and click "Search".

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
