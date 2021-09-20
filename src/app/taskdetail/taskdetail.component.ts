import { Component, OnInit } from '@angular/core';
import { TasksService } from '../tasks.service';
import * as _ from 'lodash';
import { Task } from '../task';
import { NgForm } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-taskdetail',
  templateUrl: './taskdetail.component.html',
  styleUrls: ['./taskdetail.component.css']
})
export class TaskdetailComponent implements OnInit {

  selectedprioritization: object = {
    'TaskName': '',
    'ProjectName': '',
    'Comments': ''
  }
  editProjectName: string = "";
  editSuccessMessage: string = "";
  task!: Task;
  successMessage: boolean = false;
  rowCopy: any;
  selectedIndex: number = 0;

  constructor(public taskservice: TasksService) {
  }

  ngOnInit(): void {
  }

  /**
 * @name editTask
 * @desc edit task details with a particular id
 * @returns {void}
 */
  editTask(rowData: any, index: number) {
    $('#editModal').modal('show');
    this.selectedprioritization = _.cloneDeep(rowData);
    this.task = rowData;
    this.selectedIndex = index;
  }

  /**
 * @name deleteTask
 * @desc delete task
 * @returns {void}
 */
  deleteTask(index: number) {
    this.taskservice.tasksListCopy.splice(index, 1);
    this.taskservice.tasksList = this.taskservice.tasksListCopy;
    sessionStorage.setItem("ListOfTasks", JSON.stringify(this.taskservice.tasksListCopy));
  }

  /**
  * @name editProject
  * @desc will edit a particular project from project name dropdown
  * @returns {void}
  */
  editProject(type: string, value: string) {
    if (type === "Project") {
      this.editProjectName = value;
    }
  }

  /**
  * @name saveUpdatedTask
  * @desc will update the task
  * @returns {void}
  */
  saveUpdatedTask() {
    this.rowCopy = this.selectedprioritization;
    this.task = this.rowCopy;
    this.taskservice.updateTask(this.task).subscribe(() => {
      this.selectedprioritization = this.rowCopy;
      if (this.taskservice.tasksList.indexOf(this.selectedprioritization) == -1) {
        this.taskservice.tasksList[this.selectedIndex] = this.selectedprioritization;
      }
      this.taskservice.tasksListCopy = this.taskservice.tasksList;
      sessionStorage.setItem("ListOfTasks", JSON.stringify(this.taskservice.tasksListCopy));
      this.editSuccessMessage = "You have successfully edited task";
      this.successMessage = true;
      setTimeout(() => {
        this.successMessage = false;
      }, 5000);
    },
      (error) => {

      })
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
