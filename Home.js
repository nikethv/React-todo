import React, { useEffect, useState } from "react";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [email, setEmail] = useState(""); // This can be passed from login or stored in localStorage

  useEffect(() => {
    // You should ideally get email from a global state or localStorage
    const storedEmail = localStorage.getItem("userEmail");
    setEmail(storedEmail);

    if (storedEmail) {
      fetch(`http://localhost:8501/api/tasks?email=${storedEmail}`)
        .then(res => res.json())
        .then(data => {
          setTasks(data);
        })
        .catch(err => console.error("Error fetching tasks:", err));
    }
  }, []);

  return (
    <div>
      <h2>📝 Task Dashboard</h2>
      {email ? <p>Welcome, {email}</p> : <p>Please log in</p>}

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              <strong>{task.task_name}</strong><br />
              Due: {task.due_time}<br />
              Status: {task.status}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
