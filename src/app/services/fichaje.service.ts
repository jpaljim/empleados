import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FichajeService  {

  
  constructor(
    private http: HttpClient,
  ) { }

  comprobarFichaje() {
    const headers = new HttpHeaders({
      "x-token": localStorage.getItem("token")
    });
    return this.http.get(`${base_url}/jornada/comprobar`,{headers});
  }

  fichar(accion: number, barcodeData: string) {
    const headers = new HttpHeaders({
      "x-token": localStorage.getItem("token")
    });

    const body =  {accion, barcodeData};
    return this.http.post(`${base_url}/jornada/fichar`, body, {headers});
  }

}
