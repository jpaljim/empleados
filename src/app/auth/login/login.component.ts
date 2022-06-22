import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public formSubmitted = false;

  // Propiedad que utiliza una librería llamada FormBuilder de Angular que nos permite crear un formulario, establecerle valores por defecto y como segundo parámetro realizar validaciones de los campos
  public loginForm = this.fb.group({
    email: [ localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false],
  });
  
  botonDeshabiltado = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private navCtrl: NavController
  ) {}

  // Función utilizada para realizar el login
  login() {
    // Llamamos a la función login del usuario service 
    // A la función login le mandamos lo que se haya escrito en el formulario
    // Lo que devulve la función login es un observable al cual nos podemos suscribir como es el caso, al fin y al cabo es una petición asíncrona de la que esperamos una respuesta
    this.usuarioService.login(this.loginForm.value).subscribe({
      // Si la respuesta es satisfactoria entra en Next
      next: (resp) => {
        if (resp['ok']) {
          if (this.loginForm.get('remember').value) {
            localStorage.setItem('email', this.loginForm.get('email').value);
          } else {
            localStorage.removeItem('email');
          }
        } else {
          Swal.fire('Error', resp['err'], 'error');
        }
      },
      // Si la respuesta da error entra en error
      error: err => Swal.fire('Error', err, 'error'),
      // También existe complete para ejecutar códgio independientemente de si la respuesta ha sido satisfactoria o no
      complete: () => {
        // Habilitamos el botón
        this.botonDeshabiltado = false
      }
    });
  }
}
