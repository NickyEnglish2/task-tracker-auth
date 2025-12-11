"use client";

import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import styles from "./Home.module.scss";
import { taskStore } from "@/lib/state/tasks.store";
import { formatDate } from "@/lib/format/formatDate";

const Home = observer(() => {
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    taskStore.loadTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    await taskStore.addTask(newTask);
    setNewTask("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Управление задачами</h1>

        <div className={styles.inputGroup}>
          <input
            name="newTask"
            type="text"
            placeholder="Новая задача..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <button onClick={handleAddTask} className={styles.addBtn}>Добавить задачу</button>
        </div>

        <ul className={styles.taskList}>
          {taskStore.tasks.map((task) => (
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
                      onClick={() => taskStore.startTask(task.id)}
                      className={styles.startBtn}
                    >
                      Начать выполнение
                    </button>
                  )}
                  {task.startedAt && !task.isCompleted && (
                    <button
                      onClick={() => taskStore.completeTask(task.id)}
                      className={styles.completeBtn}
                    >
                      Завершить задачу
                    </button>
                  )}
                  <button
                    onClick={() => taskStore.deleteTask(task.id)}
                    className={styles.deleteBtn}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

export default Home;
