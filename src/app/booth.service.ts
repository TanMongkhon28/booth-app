import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoothService {
  private apiUrl = 'https://wag19.bowlab.net/webapi/api/insert_booth.php';

  constructor(private http: HttpClient) { }

  getBooths(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
