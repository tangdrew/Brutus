import { Injectable }      from '@angular/core';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';

import { UsersService } from '../users/users.service';
import { User } from '../users/user';

// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class AuthService {
  lock: any;

  constructor(private usersService: UsersService, private router: Router) { }

  public authenticated() {
    // Check if there's an unexpired JWT
    // This searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  }

  public logout() {
    // Remove token from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  public getCurrentUser(): User {
    return JSON.parse(localStorage.getItem('user'));
  }
}
