import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  notificaciones: [] = [];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardService.consultarNotificaciones().subscribe({
      next: (resp: {ok: boolean, datos:[]}) => {
        this.notificaciones = resp.datos;
      },
      error:() =>{
        Swal.fire('Error', 'Error al mostrar las notificaciones.', 'error')
      }
    })
  }



}
