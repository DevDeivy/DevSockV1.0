import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Route } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../entities/user';
import { Endpoints } from '../api/backend';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  private _endpoints = Endpoints;

  constructor(private http: HttpClient){}
  
  createUser(user: User): Observable<Object>{
    return this.http.post(`${this._endpoints.createUser}`, user)
  }

  resetPasswordUser(user: User): Observable<Object>{
    return this.http.post(`${this._endpoints.resetPasswordUser}`, user)
  }
}
