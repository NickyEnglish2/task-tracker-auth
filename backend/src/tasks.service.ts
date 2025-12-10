import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  findAll(): Promise<Task[]> {
    return this.tasksRepository.find({ order: { id: 'ASC' } });
  }

  create(title: string): Promise<Task> {
    const task = this.tasksRepository.create({ title });
    return this.tasksRepository.save(task);
  }

  async update(id: number, isCompleted: boolean): Promise<void> {
    await this.tasksRepository.update(id, { isCompleted });
  }

  async remove(id: number): Promise<void> {
    await this.tasksRepository.delete(id);
  }

  async startTask(id: number): Promise<void> {
    await this.tasksRepository.update(id, { startedAt: new Date() });
  }

  async completeTask(id: number): Promise<void> {
    await this.tasksRepository.update(id, {
      isCompleted: true,
      completedAt: new Date(),
    });
  }
}
