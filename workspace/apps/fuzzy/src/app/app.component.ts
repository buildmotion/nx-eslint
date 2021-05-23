import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'workspace-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title='fuzzy' ;           

  constructor() {
    console.log('Happy component here.' ) ;         
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.')   
  }         
}


