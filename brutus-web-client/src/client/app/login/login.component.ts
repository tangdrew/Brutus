import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../shared/users/user';
import { UsersService } from '../shared/users/users.service';
import { AuthService } from '../shared/auth/auth.service';

declare var Auth0Lock: any;

@Component({
    moduleId: module.id,
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css'],
})

export class LoginComponent {
  lock: any

  constructor(private usersService: UsersService, private router: Router, private auth: AuthService) {
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
      container: 'auth0-lock-container',
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
            this.router.navigate(['/']); //TODO: wait for lock to show before rerouting
          },
          err => {
            if(err.status == 404) {
              console.log('sign up');
              let user = this.register(authResult.idTokenPayload);
              localStorage.setItem('user', JSON.stringify(user));
              this.router.navigate(['/']);
            }
            else {
              console.error(err);
            }
          }
      )
    });
  }

  ngOnInit() {
    if(!this.auth.authenticated()){
      this.lock.show();
    }
  }

  public register(idTokenPayload: any) {
    this.usersService.createUser({
      email: idTokenPayload.email,
      auth0Id: idTokenPayload.sub,
      courses: []
    }).subscribe((user: User) => {
      return user;
    });
  }

}
