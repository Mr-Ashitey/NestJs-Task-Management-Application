import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TasksService {
  // an array of tasks
  private tasks: Task[] = [];

  // return all tasks in the tasks array
  getAllTasks(): Task[] {
    return this.tasks;
  }

  // create a single task and return it
  async createTask(title: string, description: string): Promise<Task> {
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }
}
