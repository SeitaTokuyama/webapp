import React from 'react';

const Todo = ({ todo, toggleTodo, handleTodoCheckboxChange }) => {
  const handleTodoClick = () => {
    toggleTodo(todo.id);
  };

  const handleCheckboxChange = () => {
    handleTodoCheckboxChange(todo.id);
  };

  return (
    <div>
      <label>
        
        <input type="checkbox" checked={todo.completed} onChange={handleCheckboxChange} onClick={handleTodoClick}/>
      </label>
      <span>
        {todo.name}
      </span>
    </div>
  );
};

export default Todo;


