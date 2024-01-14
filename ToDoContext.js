import React, { createContext, useContext, useReducer } from 'react';

// Initial state for your todo list
const initialState = {
  todoList: []
};

// Define your actions
const ADD_TODO = 'ADD_TODO';
const DELETE_TODO = 'DELETE_TODO';
const UPDATE_TODO = 'UPDATE_TODO';

// Reducer function
function todoReducer(state, action) {
  let updatedTodoList;  // Declare the variable outside the switch block

  switch (action.type) {
    case ADD_TODO:
      return { ...state, todoList: [...state.todoList, action.payload] };
    case DELETE_TODO:
    console.log('Deleting item at index:', action.payload)
  return { ...state, todoList: state.todoList.filter((_, index) => index !== action.payload.index) };

    case UPDATE_TODO:
      updatedTodoList = [...state.todoList];  // Move the declaration here
      updatedTodoList[action.payload.index] = action.payload.todo;
      return { ...state, todoList: updatedTodoList };
    default:
      return state;
  }
}

// Create the context
const TodoContext = createContext();

// Create a provider component
function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  return (
    <TodoContext.Provider value={{ state, dispatch }}>{children}</TodoContext.Provider>
  );
}

// Custom hook to use the context
function useTodo() {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}

export { TodoProvider, useTodo, ADD_TODO, DELETE_TODO, UPDATE_TODO };