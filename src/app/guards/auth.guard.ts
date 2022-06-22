import { Injectable } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {

  constructor( private usuarioService: UsuarioService,
               private router : Router ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Cada vez que entremos a una ruta que utilice el AuthGuard llamará a la función validarToken del servicio de usuarios
    return this.usuarioService.validarToken();
  }
}
