import { TaskStatus } from '../task.model';

export class GetTaskFilterDto {
  // optional properties
  status?: TaskStatus;
  search?: string;
}
