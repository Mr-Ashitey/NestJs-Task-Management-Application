import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
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
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException('Task with this id not found.');
    }

    return task;
  }

  // create a single task and return it
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    if (!title || !description) {
      throw new HttpException('All fields are required', 400);
    }

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  // update a single task by id
  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);

    if (!task) {
      throw new NotFoundException('Task with this id not found.');
    }

    task.status = status;
    return task;
  }

  // delete a single task by id
  deleteTask(id: string): void {
    const task = this.getTaskById(id);
    if (!task) {
      throw new NotFoundException('Task with this id not found.');
    }

    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
