import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from  'shared/services/auth.service';
import { switchMap, map } from 'rxjs/operators';
import { UserService } from 'shared/services/user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuardService {

  constructor(private auth: AuthService, private userService: UserService) { }

  canActivate(): Observable<boolean> {
  	return this.auth.appUser$.pipe(map(appUser => appUser.isAdmin));
  }
  
}
