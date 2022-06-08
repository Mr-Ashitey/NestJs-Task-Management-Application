import { Injectable } from '@nestjs/common';
import { Task } from './task.model';

@Injectable()
export class TasksService {
  // an array of tasks
  private tasks: Task[] = [];

  // return all tasks in the tasks array
  getAllTasks(): Task[] {
    return this.tasks;
  }
}
