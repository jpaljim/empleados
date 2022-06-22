import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UsuarioService } from 'src/app/services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  public formSubmitted = false;

  public codigoResetPassword = '';

  public emailUrl = '';

  public tokenValido = false;

  public botonDeshabiltado= false;

  // Propiedad que utiliza una librería llamada FormBuilder de Angular que nos permite crear un formulario, establecerle valores por defecto y como segundo parámetro realizar validaciones de los campos
  public requestResetPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  public resetPasswordForm = this.fb.group(
    {
      password: ['', Validators.required],
      password2: ['', Validators.required],
    },
    {
      validators: this.passwordsIguales('password', 'password2'),
    }
  );

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.queryParams.subscribe((url) => {
      //console.log(url);
      this.codigoResetPassword = url.token || '';
      this.emailUrl = url.id || '';
    });
  }

  ngOnInit() {
    const base_url = environment.base_url;

    if (this.codigoResetPassword !== '') {
      this.usuarioService
        .conseguirTokenReseteoUsuario(this.emailUrl)
        .subscribe({
          next: (resp: any) => {
            if (resp['tokenDB'] === this.codigoResetPassword) {
              // En este caso no será necesario, pero si queremos podemos comprobar que el token es válido descomentando este código

              // const headers = new HttpHeaders({
              //   'x-token': resp['tokenDB'],
              // });

              // this.http
              //   .get(`${base_url}/auth/verifyToken`, { headers })
              //   .subscribe((resp) => {
              //     if (resp['ok']) {
              //       this.tokenValido = true;
              //     } else {
              //       this.tokenValido = false;
              //     }
              //   });
              this.tokenValido = true;
            } else {
              this.tokenValido = false;
            }
          },
        });
    }
  }

  // Función para pedir cambio de contraseña
  requestResetPassword() {
    // Por defecto formSubmitted viene false, al pulsar el botón de restablecer contraseña se establecerá como true para que salgan los mensajes en rojo de los campos inválidos
    this.formSubmitted = true;

    // Deshabilitamos el botón
    this.botonDeshabiltado = true;

    // Será invalid mientras alguna de las validaciones del formulario creado arriba no se cumpla, en este caso terminará la función
    if (this.requestResetPasswordForm.invalid) {
      // Habilitamos el botón
      this.botonDeshabiltado = false;
      return;
    } else {
      // Si el formulario es válido llamamos al usuario service
      this.usuarioService
        .requestResetPassword(this.requestResetPasswordForm.value)
        .subscribe({
          // Si la respuesta es satisfactoria entra en Next
          next: (resp) => {
            
            if (resp['ok']) {
              Swal.fire(
                'Enviado',
                'El email se ha enviado correctamente a tu correo',
                'success'
              );
            } else {
              Swal.fire('Error', resp['msg'], 'error');
            }
          },
          // Si la respuesta da error entra en error
          error: (err) => {
            
            Swal.fire('Error', err, 'error')
          },
          // También existe complete para ejecutar códgio independientemente de si la respuesta ha sido satisfactoria o no
          // Habilitamos el botón
          complete: () => this.botonDeshabiltado = false
        });
    }
  }

  // Función para cambiar la contraseña
  resetPassword() {
    this.formSubmitted = true;

    // Será invalid mientras alguna de las validaciones del formulario creado arriba no se cumpla, en este caso terminará la función
    if (this.resetPasswordForm.invalid) {
      return;
    } else {
      // Si el formulario es válido llamamos al usuario service
      this.usuarioService
        .resetPassword(
          this.resetPasswordForm.value,
          this.codigoResetPassword,
          this.emailUrl
        )
        .subscribe({
          // Si la respuesta es satisfactoria entra en Next
          next: (resp) => {
            if (resp['ok']) {
              Swal.fire('Enviado', resp['msg'], 'success');
              this.router.navigate(['/login']);
            } else {
              Swal.fire('Error', resp['msg'], 'error');
            }
          },
          // Si la respuesta da error entra en error
          error: (err) => Swal.fire('Error ggffd', err, 'error'),
          // También existe complete para ejecutar códgio independientemente de si la respuesta ha sido satisfactoria o no
        });
    }
  }

  // Una función que se utiliza en el html que devuelve true o false y se usa para mostrar los mensajes de error cuando un campo no pase su validación definida en el formulario que creamos para el registro
  campoNoValido(campo: string): boolean {
    // Comprobar si tenemos codigoResetPassword, hace un formulario si no el otro
    if (
      this.requestResetPasswordForm.get(campo).invalid &&
      this.formSubmitted
    ) {
      return true;
    } else {
      return false;
    }
  }

  // Validación personalizada utilizada en el html de registro que comprueba si ambas contraseñas son iguales
  contrasenasNoValidas() {
    const pass1 = this.resetPasswordForm.get('password').value;
    const pass2 = this.resetPasswordForm.get('password2').value;

    if (pass1 !== pass2 && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
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
