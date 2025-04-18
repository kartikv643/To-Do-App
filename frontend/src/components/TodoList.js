import React from "react";
import TodoItem from "./TodoItem";
import Loading from "./Loading";

function TodoList({ todos, onDelete, onToggle, loading }) {
  return (
    <ul className="todo-list full-w">
      {loading && <Loading/>}
      {todos.length === 0 ? (
        <p>No tasks added yet!</p>
      ) : (
        todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={onDelete}
            onToggle={onToggle}
          />
        ))
      )}
    </ul>
  );
}

export default TodoList;