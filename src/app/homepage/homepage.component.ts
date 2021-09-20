import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TasksService } from '../tasks.service';
declare var $: any;
import * as _ from 'lodash';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  projects: any = [];
  projectsCopy: any = [];
  selectedProject: string = "Select Project";
  successMessage: boolean = false;
  addSuccessMessage: string = "";

  constructor(public taskservice: TasksService) { }

  ngOnInit(): void {
    if (sessionStorage.getItem("ListOfTasks")) {
      this.taskservice.tasksList = JSON.parse(sessionStorage.getItem('ListOfTasks') || '{}');
      this.projects = JSON.parse(sessionStorage.getItem('Projects') || '');
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
      this.taskservice.tasksList = tasks;
      this.taskservice.tasksList.forEach((value: any) => {
        value['id'] = value.TaskId;
        this.taskservice.tasksListCopy.push(value);
        this.projects.push(value['ProjectName']);
      })
      this.taskservice.allProjects = this.projects;
      this.projectsCopy = this.projects;
      sessionStorage.setItem("Projects", JSON.stringify(this.projects));
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
        this.taskservice.tasksList.push(task);
        this.taskservice.tasksListCopy.push(task);
        sessionStorage.setItem("ListOfTasks", JSON.stringify(this.taskservice.tasksListCopy));
        this.addSuccessMessage = "You have successfully created a task";
        this.successMessage = true;
        setTimeout(() => {
          this.successMessage = false;
        }, 5000);
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
  * @name successClose
  * @desc close the Success Alert message
  * @returns {void}
  */
   successClose() {
    this.successMessage = false;
  }
}
