import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Task } from './task.model'; // Adjust the path as needed

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  taskform: FormGroup;
  tasks: Task[] = [];
  editMode: boolean = false;
  editTaskId: number | null = null;

  constructor() {
    this.taskform = new FormGroup({
      taskname: new FormControl('', [Validators.required]),
      taskdescription: new FormControl('', [Validators.required]),
      taskduedate: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.loadTasks();
  }

  get taskname() {
    return this.taskform.get('taskname');
  }

  get taskdescription() {
    return this.taskform.get('taskdescription');
  }

  get taskduedate() {
    return this.taskform.get('taskduedate');
  }

  loadTasks() {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      this.tasks = JSON.parse(tasks);
    }
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  Savetask(data: any) {
    if (this.editMode && this.editTaskId !== null) {
      this.tasks = this.tasks.map(task => task.id === this.editTaskId ? { ...task, ...data } : task);
      this.editMode = false;
      this.editTaskId = null;
    } else {
      const newTask: Task = {
        id: Date.now(),
        ...data,
        status: 'In Progress'
      };
      this.tasks.push(newTask);
    }
    this.saveTasks();
    this.taskform.reset();
  }

  editTask(task: Task) {
    this.taskform.setValue({
      taskname: task.taskname,
      taskdescription: task.taskdescription,
      taskduedate: task.taskduedate
    });
    this.editMode = true;
    this.editTaskId = task.id;
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveTasks();
  }

  completeTask(id: number) {
    this.tasks = this.tasks.map(task => task.id === id ? { ...task, status: 'Completed' } : task);
    this.saveTasks();
  }
}
