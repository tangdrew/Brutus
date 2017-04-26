import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';


import { Review } from './review';

@Injectable()
export class ReviewsService {

  private reviewsUrl: string = 'http://localhost:4040/api/reviews';

  constructor(private http: Http) { }

  getCourse (id: string): Observable<Review> {
    return this.http.get(this.reviewsUrl + '/' + id)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getReviews(params: any): Observable<Review[]> {
    let options = new URLSearchParams();
    options.set('course', params.course);
    return this.http.get(this.reviewsUrl, {search: options})
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  createReview (data: any): Observable<Review> {
    console.log('REVIEW: ', data);
    return this.http.post(this.reviewsUrl, data)
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
