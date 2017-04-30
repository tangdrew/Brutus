import { Injectable }      from '@angular/core';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';

import { UsersService } from '../users/users.service';
import { User } from '../users/user';
import { Course } from '../courses/course';

// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class AuthService {
  lock: any
  user: User

  constructor(private usersService: UsersService, private router: Router) {
    this.user = this.getCurrentUser();
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
    this.router.navigate(['/']);
  }

  public getCurrentUser(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  public enrolled(course: Course): boolean {
    let courseIds = this.getCurrentUser().courses.map(course => {
      return course.id;
    });
    return courseIds.includes(course.id);
  }

  public addCourse(course: Course) {
    // let currentUser = this.auth.getCurrentUser();
    this.user.courses.push(course);
    this.usersService.updateUser(this.user)
      .subscribe(user => {
        console.log('updated user: ', user);
        localStorage.setItem('user', JSON.stringify(this.user));
      });
  }

  public removeCourse(course: Course) {
    this.user.courses = this.user.courses.filter((c: Course) => c.id != course.id);
    this.usersService.updateUser(this.user)
      .subscribe(user => {
        console.log('updated user: ', user);
        localStorage.setItem('user', JSON.stringify(this.user));
      });
  }
}
