import React, { useState, useEffect} from "react";
import { MdDelete, MdEdit, MdConfirmationNumber } from "react-icons/md";
import axios from "axios";
import { format, set } from "date-fns";
import Link from "next/link";

//import component
import CheckBox from "../Components/CheckBox";


const index = () => {
  const [editText, setEditText] = useState("");
  const [todos, setTodos] = useState([]);
  const [todosCopy , setTodosCopy] = useState(todos);
  const [todoInput, setTodoInput] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [SearchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [count, setCount] = useState(0);
  const [search , setSearch] = useState("");
  const [searchItem, setSearchItem] = useState(search);


  useEffect(() => {
    fetchTodos();
  }, [count]);

  const editTodo = (index) => {
    setTodoInput(todos[index].title);
    setEditIndex(index);
  };

  const fetchTodos = async () => {
    try {
      const response =await axios.get("http://127.0.0.1:8080/todos");
      console.log(response);
      setTodos(response.data);
      setTodosCopy(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTodo = async () => {
    try {
      if (editIndex === -1) {
        // Add new todo
        await axios.post("http://127.0.0.1:8080/todos", {
          title: todoInput,
          completed: false,
        });
        setTodoInput("");
        fetchTodos(); // Fetch the updated list
      } else {
        // Update existing todo
        const todoToUpdate = { ...todos[editIndex], title: todoInput };
        await axios.put(
          `http://127.0.0.1:8080/todos/${todoToUpdate.id}`,
          todoToUpdate
        );
        setTodoInput("");
        setEditIndex(-1);
        fetchTodos(); // Fetch the updated list
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8080/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleCompleted = async (index) => {
    try {
      const todoToUpdate = {
        ...todos[index],
        completed: !todos[index].completed,
      };
      const response = await axios.put(
        `http://127.0.0.1:8080/todos/${todoToUpdate.id}`,
        todoToUpdate
      );
      const updatedTodos = [...todos];
      updatedTodos[index] = response.data;
      setTodos(updatedTodos);
      setCount(count + 1);
    } catch (error) {
      console.error(error);
    }
  };
  

  const searchTodo = () => {
    const results = todosCopy.filter((todo) =>
      todo.title.toLowerCase().includes(SearchInput.toLowerCase())
    );
    setTodos(results);
  };
  

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? "Invalid date"
        : format(date, "MM/dd/yyyy HH:mm:ss");
    } catch (error) {
      console.error(error);
      return "Invalid date";
    }
  };
  

  const renderTodos = (todosToRender) => {
    return todosToRender.map((todo, index) => (
      <li key={index} className="li">
        <CheckBox toggleCompleted={toggleCompleted} index={index} todo={todo} />
        <label htmlFor="" className="form-check-label"></label>
        <span className="todo-text">
          {`${todo.title} ${formatDate(todo.created_at)}`}
        </span>
        <span className="span-button" onClick={() => deleteTodo(todo.id)}>
          <MdDelete />
        </span>
        <span className="span-button" onClick={() => editTodo(index)}>
          <MdEdit />
        </span>
      </li>
    ));
  };
  

  // filter 
  const onHandleSearch = (value) => {
    const filteredToDo = todosCopy.filter(({title}) => 
      title.toLowerCase().includes(value.toLowerCase())
  );
  if(filteredToDo.length === 0){
    setTodos(todosCopy);
  } else {
    setTodos(filteredToDo);
    }
  };

  const onClearSearch = () => {
    if (todos.length && todosCopy.length){
      setTodos(todosCopy);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchItem), 1000);
    return () => clearTimeout(timer);
  }, [searchItem]);

  useEffect(() => {
    if(search){
      onHandleSearch(search);
    } else {
      onClearSearch();
    }
  }, [search]);

  return (
    <div className="main-body">
      <div className="todo-app">
        <div className="input-section">
          <input
            type="text"
            id="todoInput"
            placeholder="Add item..."
            value={todoInput}
            onChange={(e) => setTodoInput(e.target.value)}
          />
          <button onClick={addTodo} className="add">
            {editIndex === -1 ? "Add" : "Update"}
          </button>
          <input
            type="text"
            id="search-input"
            placeholder="Search"
            value={SearchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button onClick={searchTodo}>Search</button>
        </div>
  
        {/* Body */}
        <div className="todos">
          <ul className="todo-list">
            {todos.length === 0 ? (
              <div>
                <h1 className="not-found">No todos found</h1>
              </div>
            ) : (
              renderTodos(todos)
            )}
          </ul>
        </div>
      </div>
    </div>
  );
  
};

export default index;