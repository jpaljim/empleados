import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';

import { tap } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoginForm } from '../interfaces/login-form.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private router: Router
  ) {}

  // Servicio para validar que el token sea válido en cada página, si no lo es te echará de la parte interna de la app que solo se puede ver al iniciar sesión. Este servicio llama a la ruta del backend /auth/verifyToken
  async validarToken(): Promise<boolean> {
    //Conseguimos el token
    const token = await localStorage.getItem('token');

    // Si no tenemos el token guardado en el storage nos manda al login
    if (!token) {
      this.navCtrl.navigateRoot('/login');
      return Promise.resolve(false);
    }

    return new Promise<boolean>((resolve) => {
      const headers = new HttpHeaders({
        'x-token': token,
      });

      this.http
        .get(`${base_url}/auth/verifyToken`, { headers })
        .subscribe((resp) => {
          // Si el token existe en el storage (ya que no ha entrado en el if anterior) y es válido (ya que lo comprobamos en el backend) en este caso devolvemos true, para que en el AuthGuard nos permita entrar en la página (el guard requiere devolver true o false mediante un return)
          if (resp['ok']) {
            resolve(true);
          } else {
            // Si el token existe en el storage (ya que no ha entrado en el if anterior) pero no es válido (o por caducidad o por ser otro formato diferente de un token) devolvemos false y mandamos al login
            this.navCtrl.navigateRoot('/login');
            resolve(false);
          }
        });
    });
  }

  // Servicio para crear un usuario que llama a la ruta del backend /empleados/register
  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/empleados/register`, formData);
  }

  // Función para iniciar sesión al cual se le manda un formulario y que llama a la ruta del backend /auth/login
  login(formData: any) {
    // La función post de la librería de HttpClient devuelve un observable
    return this.http.post(`${base_url}/auth/login`, formData)
    // pipe sirve para aplicar funciones a un observable
    .pipe(
      // tap sirve para ejecutar código que no modifica el contenido del observable, a diferencia del map que sirve específicamente para esto mismo, para modificar el contenido (son operadores de rxjs)
      tap((resp: any) => {
        if (resp.token !== undefined) {
          // Si viene token es porque ha iniciado sesión en el backend y lo ha creado, por tanto lo guardamos en el storage y lo mandamos al inicio
          localStorage.setItem('token', resp.token);
          this.navCtrl.navigateForward('/dashboard', { animated: true });
        }
      })
    );
  }

  // Función para cerrar sesión
  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

  // Función para pedir cambio de contraseña
  requestResetPassword(formData: any) {
    return this.http.post(`${base_url}/empleados/requestResetPassword`, formData);
  }

  // Función para cambiar la contraseña
  resetPassword(formData: any, codigoResetPassword: any, email: any) {
    const headers = new HttpHeaders({
      "x-token": codigoResetPassword
    });

    const body = {
      nuevaPass: formData.password,
      email
    }
    return this.http.put(`${base_url}/empleados/resetPassword`, body, {headers});
  }

  // Función para conseguir el token del usuario para resetear la contraseña
  conseguirTokenReseteoUsuario(email: string) {
    return this.http.get(`${base_url}/empleados/conseguirTokenReseteoUsuario?email=${email}`);
  }
}
