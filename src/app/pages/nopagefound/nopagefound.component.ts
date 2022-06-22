import { Component } from '@angular/core';

@Component({
  selector: 'app-nopagefound',
  templateUrl: './nopagefound.component.html',
  styleUrls: ['./nopagefound.component.scss'],
})

export class NopagefoundComponent {

  // Propiedad que consigue el año en el que estamos
  year = new Date().getFullYear();

}
