import { makeAutoObservable, runInAction } from "mobx";
import { Task } from "@/types/task.types";
import * as api from "@/lib/api/tasks";

class TaskStore {
    tasks: Task[] = [];
    isLoading = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    loadTasks = async () => {
        this.isLoading = true;
        this.error = null;
        try {
            const tasks = await api.fetchTasks();
            runInAction(() => {
                this.tasks = tasks;
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.error = "Failed to load tasks";
                this.isLoading = false;
                console.error(error);
            });
        }
    };

    addTask = async (title: string) => {
        if (!title.trim()) return;
        try {
            const newTask = await api.createTask(title);
            runInAction(() => {
                this.tasks.push(newTask);
            });
        } catch (error) {
            console.error("Failed to add task", error);
            // Handle error (e.g., show toast)
        }
    };

    deleteTask = async (id: number) => {
        // Optimistic update
        const previousTasks = [...this.tasks];
        this.tasks = this.tasks.filter((t) => t.id !== id);

        try {
            await api.deleteTask(id);
        } catch (error) {
            console.error("Failed to delete task", error);
            runInAction(() => {
                this.tasks = previousTasks; // Rollback
            });
        }
    };

    startTask = async (id: number) => {
        // Optimistic update? 
        // Ideally we'd update the local state immediately. 
        // Since we need the server timestamp for `startedAt`, true optimistic update is tricky for the timestamp display.
        // However, user asked for "no constant fetch".
        // We can update the UI state to 'started' and wait for the timestamp, OR just wait for the single task response.
        // Let's UPDATE the local task with the response from the server, instead of refetching ALL tasks.

        // For now, let's try to update with the response.
        try {
            const updatedTask = await api.startTask(id);
            runInAction(() => {
                const index = this.tasks.findIndex(t => t.id === id);
                if (index !== -1) {
                    this.tasks[index] = updatedTask;
                }
            });
        } catch (error) {
            console.error("Failed to start task", error);
        }
    };

    completeTask = async (id: number) => {
        try {
            const updatedTask = await api.completeTask(id);
            runInAction(() => {
                const index = this.tasks.findIndex(t => t.id === id);
                if (index !== -1) {
                    this.tasks[index] = updatedTask;
                }
            });
        } catch (error) {
            console.error("Failed to complete task", error);
        }
    };
}

export const taskStore = new TaskStore();
