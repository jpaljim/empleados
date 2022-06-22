import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";


import { FichajeComponent } from './fichaje/fichaje.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    DashboardComponent,
    NopagefoundComponent,
    FichajeComponent,
    PagesComponent
  ],
  exports: [
    DashboardComponent,
    NopagefoundComponent,
    FichajeComponent,
    PagesComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    IonicModule
  ],
  providers: [
    
  ]
})
export class PagesModule { }
