import React, { useState } from 'react';
import TodoItem from './TodoItem';
import '../styles/TodoList.css';

function TodoList({ todos, onToggle, onDelete }) {
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'alphabetical'

  // Filter todos based on current filter
  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  // Sort todos based on current sort option
  const getSortedTodos = (filteredTodos) => {
    const sorted = [...filteredTodos];
    
    switch (sortBy) {
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'alphabetical':
        return sorted.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const filteredTodos = getFilteredTodos();
  const sortedTodos = getSortedTodos(filteredTodos);

  // Statistics
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;
  const completionPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <div className="todo-list-container">
      {/* Header with Statistics */}
      <div className="todo-list-header">
        <div className="todo-stats">
          <h3>Your Todos</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{totalTodos}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{activeTodos}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{completedTodos}</span>
              <span className="stat-label">Done</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{completionPercentage}%</span>
              <span className="stat-label">Complete</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {totalTodos > 0 && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span className="progress-text">{completionPercentage}% Complete</span>
          </div>
        )}
      </div>

      {/* Controls */}
      {totalTodos > 0 && (
        <div className="todo-controls">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({totalTodos})
            </button>
            <button
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active ({activeTodos})
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({completedTodos})
            </button>
          </div>

          <div className="sort-controls">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>
      )}

      {/* Todo Items */}
      <div className="todo-items">
        {totalTodos === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h4>No todos yet!</h4>
            <p>Add your first todo above to get started.</p>
          </div>
        ) : sortedTodos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h4>No {filter} todos</h4>
            <p>
              {filter === 'active' && 'All your todos are completed! Great job! 🎉'}
              {filter === 'completed' && 'No completed todos yet. Start checking them off!'}
            </p>
          </div>
        ) : (
          <>
            <div className="results-info">
              Showing {sortedTodos.length} of {totalTodos} todos
            </div>
            {sortedTodos.map(todo => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default TodoList;

