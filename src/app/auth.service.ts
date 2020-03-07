import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { JwtHelperService } from '@auth0/angular-jwt';
import decode from 'jwt-decode';

const jwtHelper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,private _router: Router) { }
            


  public getUserInfoFromToken(){
    const token = localStorage.getItem('id_token');
    const tokenPayload = decode(token);
    return tokenPayload.email
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('id_token');
    // Check whether the token is expired and return
    // true or false
    return !jwtHelper.isTokenExpired(token);
  }
  
  userLogin(email,password){
    return this.http.post("http://localhost:3002/auth/login",{
      "email":email,
      "password": password
    })
  }

  logoutUser() {
    localStorage.removeItem('id_token')
    this._router.navigate(['/home'])
  }

  getToken() {
    return localStorage.getItem('id_token')
  }

  loggedIn() {
    return !!localStorage.getItem('id_token')    
  }
}
