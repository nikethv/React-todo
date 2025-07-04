import React, { useEffect, useState } from "react";

function Home() {
  const [email, setEmail] = useState(""); 
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [status, setStatus] = useState("open");


  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
      fetchTasks(storedEmail);
    } else {
      alert("User not logged in!");
    }
  }, []);

  
  const fetchTasks = async (userEmail) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get-tasks/${userEmail}`);
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Add a new task
  const handleAddTask = async () => {
    if (!taskName || !dueDate || !dueTime) {
      alert("Please fill all fields");
      return;
    }

    const taskData = {
      email,
      task_name: taskName,
      status,
      due_time: `${dueDate} ${dueTime}`,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/add-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        alert("Task added successfully!");
        fetchTasks(email); 
        setTaskName("");
        setDueDate("");
        setDueTime("");
        setStatus("open");
      } else {
        alert("Failed to add task.");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome, {email}</h1>
      <h2>Task Dashboard</h2>

      {/* Add Task */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Add New Task</h3>
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        /><br />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        /><br />
        <input
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
        /><br />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select><br />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

     
      <div>
        <h3>Your Tasks</h3>
        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task._id}>
                <strong>{task.task_name}</strong> - {task.status} (Due: {task.due_time})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Home;
