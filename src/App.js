import React, { useState, useRef, useEffect } from 'react';
import TodoList from './TodoList';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [selectedTodoIds, setSelectedTodoIds] = useState([]);
  const todoNameRef = useRef();


  //DBから
  useEffect(() => {
    axios.get('https://lively-dune-01efb9a10.5.azurestaticapps.net/api/data')
      .then(response => {
        const loadedTodos = response.data.map(item => ({
          id: item.id,
          name: item.name,
          completed: item.value === "true"
        }));
        setTodos(loadedTodos);
      })
      .catch(error => {
        console.error('タスクの取得中にエラーが発生しました', error);
      });
  }, []);



  const handleAddTodo = () => {
    const name = todoNameRef.current.value;
    if (name === "") return;
    const newTodo = { id: uuidv4(), name, completed: false };

    axios.post('https://lively-dune-01efb9a10.5.azurestaticapps.net/api/data', { name, value: newTodo.completed.toString() })
      .then(response => {
        setTodos((prevTodos) => [...prevTodos, response.data]);
      })
      .catch(error => {
        console.error('タスクの追加中にエラーが発生しました', error);
      });
      
    todoNameRef.current.value = null;
  };



  const toggleTodo = (id) => {
    const newTodos = [...todos];
    const todo = newTodos.find((todo) => todo.id === id);
    todo.completed = !todo.completed;
    setTodos(newTodos);
  };



  const handleTodoCheckboxChange = (id) => {
    console.log("aaa");
    if (selectedTodoIds.includes(id)) {
      setSelectedTodoIds(selectedTodoIds.filter(todoId => todoId !== id));
      console.log("bbb");
    } else {
      setSelectedTodoIds([...selectedTodoIds, id]);
      console.log("ccc");
    }
  };



  const handleClear = () => {
    const promises = selectedTodoIds.map(todoId => 
      axios.delete(`https://lively-dune-01efb9a10.5.azurestaticapps.net/api/data/${todoId}`)
    );

    Promise.all(promises)
      .then(() => {
        const newTodos = todos.filter((todo) => !selectedTodoIds.includes(todo.id));
        setTodos(newTodos);
        setSelectedTodoIds([]);
      })
      .catch(error => {
        console.error('タスクの削除中にエラーが発生しました', error);
      });
  };



  return (
    <div>
      <h2 className="title">TASK MANAGEMENT TOOLS</h2>
      <div className="input-container">
        <div className="task">
          <TodoList todos={todos} toggleTodo={toggleTodo} handleTodoCheckboxChange={handleTodoCheckboxChange}/> 
        </div>
        <input className="input" type="text" ref={todoNameRef}/>
        <button className="addtask" onClick={handleAddTodo}>タスクを追加</button>
        <button className="deltask" onClick={handleClear}>選択したタスクを削除</button>
      
        <div className="resttask">残りのタスク: {todos.filter((todo) => !todo.completed).length}</div>
      </div>
    </div>
  );
}

export default App;
