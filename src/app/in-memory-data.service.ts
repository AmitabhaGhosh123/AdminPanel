import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Task } from './task';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const tasks = [
      { TaskId: 1, TaskName: 'Task Name1', ProjectName: 'Java Project', Comments: '', id: 1 },
      { TaskId: 2, TaskName: 'Task Name2', ProjectName: 'Python Project', Comments: '', id: 2 },
      { TaskId: 3, TaskName: 'Task Name3', ProjectName: 'DevOps Project', Comments: '', id: 3 },
    ];
    return {tasks};
  }

  genId(tasks: Task[]): number {
    return tasks.length > 0 ? Math.max(...tasks.map(task => task.TaskId)) + 1 : 11;
  }

  constructor() { }
}
