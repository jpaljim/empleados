import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private base_url = environment.base_url;

  constructor(private http: HttpClient) { }

  consultarNotificaciones() {
    const headers = new HttpHeaders({
      "x-token": localStorage.getItem("token")
    });
    return this.http.get(`${this.base_url}/dashboard/notificaciones`,{headers});
  }
}
