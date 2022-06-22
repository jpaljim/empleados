import { Component, OnInit } from '@angular/core';

declare function customInitFunctions();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    customInitFunctions();
  }

  fechaActual() {
    var fecha = new Date();
    var year = fecha.getFullYear();
    return year;
  }

}
