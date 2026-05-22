import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endpoints } from '../api/backend';
import { Observable } from 'rxjs';
import { EmailResetPassword } from '../entities/email-reset';

@Injectable({
  providedIn: 'root',
})
export class EmailService {

  private _endpoints = Endpoints;
  
  constructor(private http: HttpClient) { }
  

  validateCode(code: String):Observable<object>{
    return this.http.post(`${Endpoints.validateCode}`, code)
  }

  resetPassword(email: EmailResetPassword): Observable<Object>{
    return this.http.post(`${this._endpoints.passwordCode}`, email)
  }
}
