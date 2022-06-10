import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  // an array of tasks
  private tasks: Task[] = [];

  // return all tasks in the tasks array
  getAllTasks(): Task[] {
    return this.tasks;
  }

  //   get a single task by id
  getTaskById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
  }

  // create a single task and return it
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    console.log(createTaskDto);
    const { title, description } = createTaskDto;
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
