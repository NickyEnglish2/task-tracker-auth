import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Post()
  create(@Body('title') title: string) {
    return this.tasksService.create(title);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('isCompleted') isCompleted: boolean) {
    return this.tasksService.update(+id, isCompleted);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }

  @Patch(':id/start')
  start(@Param('id') id: string) {
    return this.tasksService.startTask(+id);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.tasksService.completeTask(+id);
  }
}
