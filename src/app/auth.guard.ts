import { Injectable } from '@angular/core';
import { CanActivate, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
  constructor(private _authService: AuthService,
    private _router: Router) { }

  // canActivate(): boolean {
  //   if (this._authService.loggedIn()) {
  //     //console.log('true')
  //     return true
  //   } else {
  //     //console.log('false')            
  //     this._router.navigate(['/login'])
  //     return false
  //   }
  // }
  canActivate(): boolean {
    if (!this._authService.isAuthenticated()) {
      this._router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
