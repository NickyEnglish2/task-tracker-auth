import axios from "axios";
import { Task } from "@/types/task.types";

const API_URL = "http://localhost:3000/tasks";

export const fetchTasks = async (): Promise<Task[]> => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createTask = async (title: string): Promise<Task> => {
    const response = await axios.post(API_URL, { title });
    return response.data; // Assuming backend returns the created task
};

export const deleteTask = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};

export const startTask = async (id: number): Promise<Task> => {
    const response = await axios.patch(`${API_URL}/${id}/start`);
    return response.data; // Assuming backend returns the updated task
};

export const completeTask = async (id: number): Promise<Task> => {
    const response = await axios.patch(`${API_URL}/${id}/complete`);
    return response.data; // Assuming backend returns the updated task
};
