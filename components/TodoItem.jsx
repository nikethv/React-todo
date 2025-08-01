import React, { useState } from 'react';
import '../styles/TodoItem.css';

function TodoItem({ todo, onToggle, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    if (isToggling || isDeleting) return;
    
    setIsToggling(true);
    try {
      await onToggle(todo._id);
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
    setIsToggling(false);
  };

  const handleDelete = async () => {
    if (isDeleting || isToggling) return;
    
    // Ask for confirmation
    if (window.confirm('Are you sure you want to delete this todo?')) {
      setIsDeleting(true);
      try {
        await onDelete(todo._id);
      } catch (error) {
        console.error('Error deleting todo:', error);
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${isDeleting ? 'deleting' : ''}`}>
      <div className="todo-content">
        <div className="todo-main">
          <button
            className={`toggle-button ${todo.completed ? 'checked' : ''}`}
            onClick={handleToggle}
            disabled={isToggling || isDeleting}
            title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {isToggling ? (
              <span className="loading-spinner">⟳</span>
            ) : (
              <span className="checkmark">{todo.completed ? '✓' : ''}</span>
            )}
          </button>

          <div className="todo-text-container">
            <span className="todo-text">
              {todo.text}
            </span>
            <div className="todo-meta">
              <span className="todo-date">
                {todo.createdAt && formatDate(todo.createdAt)}
              </span>
              <span className={`todo-status ${todo.completed ? 'completed-status' : 'pending-status'}`}>
                {todo.completed ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        <button
          className="delete-button"
          onClick={handleDelete}
          disabled={isDeleting || isToggling}
          title="Delete todo"
        >
          {isDeleting ? (
            <span className="loading-spinner">⟳</span>
          ) : (
            <span className="delete-icon">🗑️</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
