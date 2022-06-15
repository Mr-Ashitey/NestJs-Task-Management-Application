import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService', { timestamp: true });
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  // get all tasks
  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.tasksRepository.createQueryBuilder('task');
    query.where({ user }); // give user tasks owned by current user

    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();

      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }". Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );

      throw new InternalServerErrorException('Error getting tasks.');
    }
  }

  // find a task by id
  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id, user } });
    if (!task) {
      this.logger.error(`Task with id "${id}" not found.`);
      throw new NotFoundException('Task not found.');
    }

    return task;
  }

  // create a new task
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    try {
      await this.tasksRepository.save(task);

      return task;
    } catch (error) {
      this.logger.error(
        `Failed to create a task for user "${
          user.username
        }". Data: ${JSON.stringify(createTaskDto)}`,
        error.stack,
      );

      throw new InternalServerErrorException('Error creating task.');
    }
  }

  // update a task's status
  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;

    try {
      await this.tasksRepository.save(task);

      return task;
    } catch (error) {
      this.logger.error(
        `Failed to update task "${id}". Data: ${JSON.stringify({
          id,
          status,
        })}`,
        error.stack,
      );

      throw new InternalServerErrorException('Error updating task.');
    }
  }

  // delete a task
  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });

    if (result.affected === 0) {
      this.logger.error(`Failed to delete task "${id}".`);
      throw new NotFoundException('Task with this id not found.');
    }
  }
  // // an array of tasks
  // private tasks: Task[] = [];
  // // return all tasks in the tasks array
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  // getTasksWithFilters(filterDto: GetTaskFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter(
  //       (task) =>
  //         task.title.includes(search) || task.description.includes(search),
  //     );
  //   }
  //   return tasks;
  // }
  // //   get a single task by id
  // getTaskById(id: string): Task {
  //   const task = this.tasks.find((task) => task.id === id);
  //   if (!task) {
  //     throw new NotFoundException('Task with this id not found.');
  //   }
  //   return task;
  // }
  // // create a single task and return it
  // async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }
  // // update a single task by id
  // updateTaskStatus(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
  // // delete a single task by id
  // deleteTask(id: string): void {
  //   this.getTaskById(id); // do this so we can throw an error when id is not found
  //   this.tasks = this.tasks.filter((task) => task.id !== id);
  // }
}
