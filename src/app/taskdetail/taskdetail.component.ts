import { Component, Input, OnInit } from '@angular/core';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-taskdetail',
  templateUrl: './taskdetail.component.html',
  styleUrls: ['./taskdetail.component.css']
})
export class TaskdetailComponent implements OnInit {

  constructor(public taskservice:TasksService) { 
  }

  ngOnInit(): void {
    this.taskservice.onMenuToDetailsAction.subscribe(actionType => {
      if(actionType == 'update') {

      }
    })
  }

}
