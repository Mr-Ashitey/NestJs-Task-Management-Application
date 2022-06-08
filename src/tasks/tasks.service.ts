import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  // an array of tasks
  private tasks: Task[] = [];

  // return all tasks in the tasks array
  getAllTasks(): Task[] {
    return this.tasks;
  }

  // create a single task and return it
  createTask(title: string, description: string): Task {
    const task: Task = {
      id: Math.random().toString(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);

    return task;
  }
}
