import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  public formSubmitted = false;

  public botonDeshabiltado= false;

  // Propiedad que utiliza una librería llamada FormBuilder de Angular que nos permite crear un formulario, establecerle valores por defecto y como segundo parámetro realizar validaciones de los campos
  public registerForm = this.fb.group(
    {
      dni: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password2: ['', Validators.required],
      terminos: [true, Validators.required],
    },
    {
      validators: this.passwordsIguales('password', 'password2'),
    }
  );

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {}

  // Función para crear usuarios
  crearUsuario() {
    // Por defecto formSubmitted viene false, al pulsar el botón de registrar se establecerá como true para que salgan los mensajes en rojo de los campos inválidos
    this.formSubmitted = true;

     // Deshabilitamos el botón
     this.botonDeshabiltado = true;

    // Será invalid mientras alguna de las validaciones del formulario creado arriba no se cumpla, en este caso terminará la función
    if (this.registerForm.invalid) {
      // Habilitamos el botón
      this.botonDeshabiltado = false;
      return;
    } else {
      // Si el formulario es válido llamamos al usuario service
      this.usuarioService
        // Llamamos a la función crear usuario y le pasamos el formulario
        .crearUsuario(this.registerForm.value)
        .subscribe((resp) => {
          if (resp['ok']) {
            // Si el usuario se registra bien además iniciará sesión llamando a la función login pasandole el usuario y la contrasaeña que acabamos de registrar
            this.usuarioService
              .login({
                email: this.registerForm.value.email,
                password: this.registerForm.value.password,
              })
              .subscribe({
                // En caso de error del login se mostrará un error con una librería llamada sweetAlert2
                error: (err) => Swal.fire('Error', resp['err'], 'error'),
                complete: () => {
                  // Habilitamos el botón
                  this.botonDeshabiltado = false
                }      
                
              });
          } else {
            // Habilitamos el botón
            this.botonDeshabiltado = false
            Swal.fire('Error', resp['err'], 'error');
          }
        });
    }
  }

  // Una función que se utiliza en el html que devuelve true o false y se usa para mostrar los mensajes de error cuando un campo no pase su validación definida en el formulario que creamos para el registro 
  campoNoValido(campo: string): boolean {
    if (this.registerForm.get(campo).invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  // Validación personalizada utilizada en el html de registro que comprueba si ambas contraseñas son iguales
  contrasenasNoValidas() {
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if (pass1 !== pass2 && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  // Validación personalizada utilizada en el formulario de registro que comprueba si se han aceptado los términos
  aceptaTerminos() {
    return !this.registerForm.get('terminos').value && this.formSubmitted;
  }

  // Validación personalizada utilizada en el formulario de registro que comprueba si ambas contraseñas son iguales
  passwordsIguales(pass1Name: string, pass2Name: string) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ noEsIgual: true });
      }
    };
  }
}
