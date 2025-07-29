import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AddTodo from '../components/AddTodo';
import TodoList from '../components/TodoList';
import '../styles/Homepage.css';

function HomePage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, logout, getUserDisplayName } = useAuth();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Move fetchTodos function INSIDE useEffect to fix ESLint warning
    const fetchTodos = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`${API_URL}/api/todos`);
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
        setError('Failed to load todos. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [API_URL]); // Add API_URL to dependencies

  // Keep a separate fetchTodos for manual refresh
  const refreshTodos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_URL}/api/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Failed to load todos. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (text) => {
    try {
      const response = await axios.post(`${API_URL}/api/todos`, { text });
      setTodos(prevTodos => [response.data, ...prevTodos]);
      return Promise.resolve();
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Failed to add todo. Please try again.');
      return Promise.reject(error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t._id === id);
      const response = await axios.put(`${API_URL}/api/todos/${id}`, {
        completed: !todo.completed
      });
      
      setTodos(prevTodos =>
        prevTodos.map(t => t._id === id ? response.data : t)
      );
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo. Please try again.');
      return Promise.reject(error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/todos/${id}`);
      setTodos(prevTodos => prevTodos.filter(t => t._id !== id));
      return Promise.resolve();
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Failed to delete todo. Please try again.');
      return Promise.reject(error);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  const clearError = () => {
    setError('');
  };

  if (loading) {
    return (
      <div className="homepage-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage-container">
      {/* Header */}
      <header className="homepage-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Welcome back, {getUserDisplayName()}! 👋</h1>
            <p>Stay organized and get things done</p>
          </div>
          
          <div className="header-actions">
            <button 
              onClick={refreshTodos}
              className="refresh-button"
              title="Refresh todos"
            >
              🔄 Refresh
            </button>
            <button 
              onClick={handleLogout}
              className="logout-button"
            >
              👤 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <span className="error-message">{error}</span>
            <button onClick={clearError} className="error-close">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="homepage-main">
        <div className="main-content">
          {/* Add Todo Section */}
          <section className="add-todo-section">
            <AddTodo onAdd={addTodo} />
          </section>

          {/* Todo List Section */}
          <section className="todo-list-section">
            <TodoList 
              todos={todos} 
              onToggle={toggleTodo} 
              onDelete={deleteTodo} 
            />
          </section>
        </div>

        {/* Sidebar with Quick Stats */}
        <aside className="homepage-sidebar">
          <div className="sidebar-content">
            <div className="quick-stats-card">
              <h3>📊 Quick Stats</h3>
              <div className="stat-row">
                <span>Total Tasks:</span>
                <span className="stat-value">{todos.length}</span>
              </div>
              <div className="stat-row">
                <span>Completed:</span>
                <span className="stat-value completed">
                  {todos.filter(t => t.completed).length}
                </span>
              </div>
              <div className="stat-row">
                <span>Remaining:</span>
                <span className="stat-value pending">
                  {todos.filter(t => !t.completed).length}
                </span>
              </div>
            </div>

            <div className="tips-card">
              <h3>💡 Tips</h3>
              <ul>
                <li>Click the circle to mark tasks complete</li>
                <li>Use filters to organize your view</li>
                <li>Double-click to edit tasks (coming soon!)</li>
                <li>Stay consistent and celebrate progress! 🎉</li>
              </ul>
            </div>

            <div className="user-info-card">
              <h3>👤 Account</h3>
              <div className="user-details">
                <p><strong>Name:</strong> {currentUser?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {currentUser?.email || 'N/A'}</p>
                <p><strong>Member since:</strong> {
                  currentUser?.createdAt 
                    ? new Date(currentUser.createdAt).toLocaleDateString()
                    : 'N/A'
                }</p>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="homepage-footer">
        <p>&copy; 2024 My Todo App. Built with React & MongoDB</p>
      </footer>
    </div>
  );
}

export default HomePage;
