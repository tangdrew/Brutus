import { Injectable }      from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';

import { UsersService } from '../users/users.service';
import { User } from '../users/user';

// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class AuthService {
  lock: any;

  constructor(private usersService: UsersService) {
    // Configure Auth0
    this.lock = new Auth0Lock('TqJtsgudxBIWinhXv6Sjf0Rz0jPrYIvn', 'popup.auth0.com', {
      theme: {
        logo: '../../../assets/images/logo.gif',
        foregroundColor: '#634b89',
        primaryColor: '#634b89',
      },
      languageDictionary: {
        title: "Brutus"
      },
      responseType: 'token',
      redirectUrl: window.location.origin,
      auth: {
        params: {
          scope: 'openid email user_metadata app_metadata picture'
        }
      }
    });

    // Add callback for lock `authenticated` event
    this.lock.on("authenticated", (authResult: any) => {
      localStorage.setItem('id_token', authResult.idToken);
      console.log(authResult);
      this.usersService.getUser(authResult.idTokenPayload.sub)
        .subscribe(
          user => {
            console.log('Welcome back ', user);
            localStorage.setItem('user', JSON.stringify(user));
          },
          err => {
            if(err.status == 404) {
              console.log('sign up');
              let user = this.register(authResult.idTokenPayload);
              localStorage.setItem('user', JSON.stringify(user));
            }
            else {
              console.error(err);
            }
          }
      )
    });
  }

  public login() {
    // Call the show method to display the widget.
    this.lock.show();
  }

  public authenticated() {
    // Check if there's an unexpired JWT
    // This searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  }

  public logout() {
    // Remove token from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('user');
  }

  public register(idTokenPayload: any) {
    this.usersService.createUser({
      email: idTokenPayload.email,
      auth0Id: idTokenPayload.sub,
      courses: []
    }).subscribe(user => {
      return user;
    });
  }

  public getCurrentUser(): User {
    return JSON.parse(localStorage.getItem('user'));
  }
}
