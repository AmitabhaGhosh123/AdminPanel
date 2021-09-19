import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Task } from './task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private tasksUrl = 'api/tasks';  // URL to web api
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  _menuToDetailsAction: string = '';
  menuToDetailsAction: Subject<string> = new Subject<string>();
  public onMenuToDetailsAction = this.menuToDetailsAction.asObservable();

  //return the action from menu
  get menuToDetails() {
    return this._menuToDetailsAction;
  }
  //set action from menu
  set menuToDetails(value) {
    this._menuToDetailsAction = value;
    this.menuToDetailsAction.next(value);
  }

  constructor(private http:HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.tasksUrl);
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.tasksUrl, task, this.httpOptions);
  }

  updateTask(task: Task): Observable<any> {
    return this.http.put(this.tasksUrl, task, this.httpOptions);
  }

  getTask(id: number): Observable<Task> {
    const url = `${this.tasksUrl}/${id}`;
    return this.http.get<Task>(url);
  }
  
}
