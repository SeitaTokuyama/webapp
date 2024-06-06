import React from 'react';
import Todo from './Todo';

const TodoList = ({ todos, toggleTodo, handleTodoCheckboxChange }) => {
  return todos.map((todo) => (
    <Todo key={todo.id} todo={todo} toggleTodo={toggleTodo} handleTodoCheckboxChange={handleTodoCheckboxChange} />
  ));
};

export default TodoList;
