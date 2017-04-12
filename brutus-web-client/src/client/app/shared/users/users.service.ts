import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as Rx from "rxjs/Rx";


import { User } from './user';

@Injectable()
export class UsersService {

  private usersUrl: string = 'http://localhost:4040/api/users';

  constructor(private http: Http) { }

  getUser (id: string): Observable<User> {
    return this.http.get(this.usersUrl + '/' + id)
                    .map(this.extractData)
                    // .catch(this.handleError); //don't handle error here, signal for new user

  }

  createUser (data: any): Observable<User> {
    return this.http.post(this.usersUrl, data)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  updateUser (user: User): Observable<User> {
    return this.http.put(this.usersUrl + '/' + user.auth0Id, user)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
