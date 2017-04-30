import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';


import { Course } from './course';

@Injectable()
export class CoursesService {

  private coursesUrl: string = 'http://localhost:4040/api/courses';

  constructor(private http: Http) { }

  getCourse (id: string): Observable<Course> {
    return this.http.get(this.coursesUrl + '/' + id)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getCourses(params: any): Observable<Course[]> {
    let options = new URLSearchParams();
    console.log("Params: ", params);
    options.set('term', params.term);
    if(params.factor != 'Sort By...') {
      options.set('factor', params.factor);
    }
    options.set('subject', params.subject);
    options.set('searchTerm', params.searchTerm);
    options.set('skip', params.skip);
    options.set('limit', params.limit);
    return this.http.get(this.coursesUrl, {search: options})
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  createCourse (data: any): Observable<Course> {
    return this.http.post(this.coursesUrl, data)
                    .map((course) => console.log(course))
                    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    //return body.data || { };
    console.log(body);
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
