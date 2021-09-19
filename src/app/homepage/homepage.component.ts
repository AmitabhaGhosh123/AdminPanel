import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TasksService } from '../tasks.service';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;
import * as _ from 'lodash';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  tasksList: any = [];
  tasksListCopy: any[] = [];
  projects: any = [];
  projectsCopy: any = [];
  tasks = [];
  selectedProject: string = "Select Project";

  constructor(public taskservice: TasksService) { }

  ngOnInit(): void {
    if (sessionStorage.getItem("ListOfTasks")) {
      this.tasksList = JSON.parse(sessionStorage.getItem('ListOfTasks') || '{}');
    }
    else {
      this.getTasks();
    }
  }

  get TaskName() {
    return this.taskForm.get('TaskName');
  }

  taskForm = new FormGroup({
    TaskName: new FormControl("", Validators.required),
    ProjectName: new FormControl("", Validators.required),
    Comments: new FormControl("")
  });

  /**
 * @name openPopUp
 * @desc open create task modal popup
 * @returns {void}
 */
  openAddTaskPopUp() {
    $('#addTaskModal').modal('show');
  }

  /**
  * @name getTasks
  * @desc will get all created tasks
  * @returns {void}
  */
  getTasks() {
    this.taskservice.getTasks().subscribe(tasks => {
      this.tasksList = tasks;
      this.tasksList.forEach((value: any) => {
        this.tasksListCopy.push(value);
        this.projects.push(value['ProjectName']);
      })
      sessionStorage.setItem("Projects", JSON.stringify(this.projects));
      this.projectsCopy = this.projects;
    },
      (error) => {

      })
  }

  /**
  * @name populateProjects
  * @desc will populate list of all project names in project name dropdown
  * @returns {void}
  */
  populateProjects() {
    this.projects = this.projectsCopy;
    sessionStorage.setItem("Projects", JSON.stringify(this.projects));
  }

  /**
  * @name selectProject
  * @desc will select a particular project from project name dropdown
  * @returns {void}
  */
  selectProject(type: string, value: string) {
    if (type === "Project") {
      this.selectedProject = value;
    }
  }

  /**
  * @name addTask
  * @desc will set createnewTask Form values
  * @returns {void}
  */
  addTask() {
    this.taskForm.value.ProjectName = this.selectedProject;
    this.taskservice.addTask(this.taskForm.value)
      .subscribe((task: any) => {
        task['TaskId'] = task['id'];
        this.tasksList.push(task);
        this.tasksListCopy.push(task);
        sessionStorage.setItem("ListOfTasks", JSON.stringify(this.tasksListCopy));
        this.cancelAddTask();
      },
        (error) => {

        });
  }

  /**
 * @name checkMandatoryVal
 * @desc check mandatory validations for form
 * @returns {void}
 */
  checkMandatoryVal() {
    if (this.taskForm.value.TaskName == undefined || this.taskForm.value.TaskName == null || this.taskForm.value.TaskName.trim() == ""
      || this.taskForm.controls.TaskName.invalid || this.selectedProject == "Select Project")
      return true;
    else
      return false;
  }

  /**
 * @name cancelAddTask
 * @desc cancel adding new task and reset the form
 * @returns {void}
 */
  cancelAddTask() {
    this.taskForm.controls['TaskName'].reset();
    this.taskForm.controls['Comments'].reset();
    this.selectedProject = "Select Project";
  }

  /**
 * @name deleteTask
 * @desc delete task
 * @returns {void}
 */
  deleteTask(index: number) {
    this.tasksListCopy.splice(index, 1);
    this.tasksList = this.tasksListCopy;
    sessionStorage.setItem("ListOfTasks", JSON.stringify(this.tasksListCopy));
  }

}
