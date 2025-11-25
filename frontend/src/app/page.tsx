"use client";

import { useState, useEffect, useCallback } from "react"; // 1. Import useCallback
import axios from "axios";
import styles from "./Home.module.scss";

interface Task {
  id: number;
  title: string;
  isCompleted: boolean;
}

const API_URL = "http://localhost:3000/tasks";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  // 2. Wrap the function in useCallback
  // This ensures the function object stays the same between renders
  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Error connecting to backend", error);
    }
  }, []);

  // 3. Now safely call it in useEffect with the dependency
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
  }, [fetchTasks]); 

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      await axios.post(API_URL, { title: newTask });
      setNewTask("");
      fetchTasks(); // Re-fetch list
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  const toggleTask = async (id: number, isCompleted: boolean) => {
    try {
      await axios.patch(`${API_URL}/${id}`, { isCompleted: !isCompleted });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Task Manager</h1>
        
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="New Task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <button onClick={addTask}>Add</button>
        </div>

        <ul className={styles.taskList}>
          {tasks.map((task) => (
            <li key={task.id}>
              <div className={styles.taskContent}>
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() => toggleTask(task.id, task.isCompleted)}
                />
                <span className={task.isCompleted ? styles.completed : ""}>
                  {task.title}
                </span>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className={styles.deleteBtn}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
