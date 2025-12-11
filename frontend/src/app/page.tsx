"use client";

import { useState, useEffect, useCallback } from "react"; // 1. Import useCallback
import axios from "axios";
import styles from "./Home.module.scss";
import { Task } from "@/types/task.types";

const API_URL = "http://localhost:3000/tasks";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Error connecting to backend", error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      await axios.post(API_URL, { title: newTask });
      setNewTask("");
      fetchTasks();
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  const startTask = async (id: number) => {
    try {
      await axios.patch(`${API_URL}/${id}/start`);
      fetchTasks();
    } catch (error) {
      console.error("Error starting task", error);
    }
  };

  const completeTask = async (id: number) => {
    try {
      await axios.patch(`${API_URL}/${id}/complete`);
      fetchTasks();
    } catch (error) {
      console.error("Error completing task", error);
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
          <button onClick={addTask} className={styles.addBtn}>Add</button>
        </div>

        <ul className={styles.taskList}>
          {tasks.map((task) => (
            <li key={task.id}>
              <div className={styles.taskContent}>
                <div className={styles.taskHeader}>
                  <span className={styles.taskTitle}>
                    {task.title}
                  </span>
                  <div className={styles.dates}>
                    {task.startedAt && (
                      <span className={styles.date}>
                        Начато: {formatDate(task.startedAt)}
                      </span>
                    )}
                    {task.completedAt && (
                      <span className={styles.date}>
                        Завершено: {formatDate(task.completedAt)}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.actions}>
                  {!task.startedAt && !task.isCompleted && (
                    <button
                      onClick={() => startTask(task.id)}
                      className={styles.startBtn}
                    >
                      Start
                    </button>
                  )}
                  {task.startedAt && !task.isCompleted && (
                    <button
                      onClick={() => completeTask(task.id)}
                      className={styles.completeBtn}
                    >
                      Complete
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
