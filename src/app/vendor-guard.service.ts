import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './service/auth.service';

@Injectable({providedIn: 'root'})
export class VendorGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
  : Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.user.pipe(map(user => {
      if (user.myProduct === undefined) {
        this.router.navigate(['/main/products']);
      }
      return !!user;
    }));
  }
}
