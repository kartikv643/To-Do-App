import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SplashScreen from "./components/SplashScreen";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import "./App.css";

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const [loadingMain, setLoadingMain] = useState(true);
  const [loading, setLoading] = useState(false)
  const handleDataLoad = () => {
    setLoadingMain(true)
    fetch(`${process.env.REACT_APP_API_URL}/api/todos`)
      .then((res) => res.json())
      .then((data) => {
        setTodos(data)
        setLoadingMain(false)
      }).catch(error => {
        console.log(error)
        setLoadingMain(false)
      });
  }

  useEffect(() => {
    handleDataLoad()
  }, []);
  
  const addTodo = (text) => {
    setLoading(true)
    const newTodo = { id: Date.now(), text, completed: false };
    fetch(`${process.env.REACT_APP_API_URL}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    }).then(() => {
      setTodos([...todos, newTodo])
      setLoading(false)
    }).catch(error => {
      console.log(error)
      setLoading(false)
    });
  };
  
  const deleteTodo = (id) => {
    setLoading(true)
    fetch(`${process.env.REACT_APP_API_URL}/api/todos/${id}`, {
      method: "DELETE",
    }).then(() => {
      setTodos(todos.filter((t) => t.id !== id))
      setLoading(false)
    }).catch(error => {
      console.log(error)
      setLoading(false)
    });
  };
  
  const toggleComplete = (id) => {
    setLoading(true)
    const updatedTodos = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    const updated = updatedTodos.find((t) => t.id === id);
  
    fetch(`${process.env.REACT_APP_API_URL}/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: updated.completed }),
    }).then(() => {
      setTodos(updatedTodos)
      setLoading(false)
    }).catch(error => {
      console.log(error)
      setLoading(false)
    });
  };
  

  if (loadingMain) return <SplashScreen />;

  return (
    <div className="app-container center column full-hw">
      <Header />
      <div className="center column full-h" style={{width: "90%", maxWidth: "350px", justifyContent:"flex-start"}}>
        <TodoInput onAdd={addTodo} loading={loading}/>
        <TodoList loading={loading}
          todos={todos}
          onDelete={deleteTodo}
          onToggle={toggleComplete}
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;