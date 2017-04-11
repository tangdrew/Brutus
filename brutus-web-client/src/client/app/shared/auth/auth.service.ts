import { Injectable }      from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';

// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class AuthService {
  // Configure Auth0
  lock = new Auth0Lock('TqJtsgudxBIWinhXv6Sjf0Rz0jPrYIvn', 'popup.auth0.com', {
    theme: {
      logo: '../../../assets/images/logo.gif',
      foregroundColor: '#634b89',
      primaryColor: '#634b89',
    },
    languageDictionary: {
      title: "Brutus"
    },
    responseType: 'token',
    redirectUrl: window.location.origin
  });

  constructor() {
    // Add callback for lock `authenticated` event
    this.lock.on("authenticated", (authResult: any) => {
      localStorage.setItem('id_token', authResult.idToken);
      console.log(authResult);
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
  }
}
