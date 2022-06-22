import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

import { DashboardComponent } from './dashboard/dashboard.component';
import { FichajeComponent } from './fichaje/fichaje.component';
import { PagesComponent } from './pages.component';

//Estas son las páginas a las que podemos acceder cuando hemos iniciado sesión y tenemos un token válido
const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    // Por eso utilizamos el Guard para comrpobar que el token existe y es válido

    children: [
      { path: '', component: DashboardComponent, data: {titulo: 'Dashboard'}, canActivate: [ AuthGuard ],},
      { path: 'fichaje', component: FichajeComponent, data: {titulo: 'Fichaje'}, canActivate: [ AuthGuard ], },
    ]
   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PagesRoutingModule {}