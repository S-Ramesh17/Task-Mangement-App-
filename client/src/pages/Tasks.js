import React, { useState, useEffect } from "react";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>Tasks</h1>
      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        tasks.map((task, index) => (
          <div key={index}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Tasks;