import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ReviewsService } from '../shared/reviews/reviews.service';
import { Review } from '../shared/reviews/review';
import { CoursesService } from '../shared/courses/courses.service';
import { Course } from '../shared/courses/course';
import { TermsService } from '../shared/terms/terms.service';
import { Term } from '../shared/terms/term';
import { UsersService } from '../shared/users/users.service';
import { User } from '../shared/users/user';
import { AuthService } from '../shared/auth/auth.service';

@Component({
    moduleId: module.id,
    selector: 'reviews',
    templateUrl: 'reviews.component.html',
    styleUrls: ['reviews.component.css'],
})

export class ReviewsComponent {
  text: string
  terms: Term[]
  termNames: string[]
  subjects: string[]
  currentUser: User
  transcriptReviews: any = {}
  showTextarea: boolean = true
  keys: string[] = []

  constructor(private coursesService: CoursesService, private termsService: TermsService, private auth: AuthService) {}

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser();
    this.termsService.getTerms()
      .subscribe(terms => {
        this.terms = terms;
        this.termNames = terms.map(term => {
          return term.name;
        });
        this.subjects = this.terms[0].subjects.map((subject: any) => {
          return subject.symbol;
        });
      })
  }

  parse(): void {
    let startFlag = false;
    let textArray = this.text.split("\n");
    let term = '';
    textArray.forEach((line: string) => {
      //Ignore everything until "Beginning of Undergraduate Record"
      if(line.includes("Beginning of Undergraduate Record")) {
        startFlag = true;
      }

      if(startFlag) {
        let lineArray: string[] = line.replace(/\s+/g, ' ').split(" ");
        //Parse out term
        if(this.termNames.includes(lineArray[1]+" "+lineArray[2])){
          // console.log(line);
          term = lineArray[1]+" "+lineArray[2];
        }
        //Parse courses
        if(this.subjects.includes(lineArray[0])) {
          // console.log(line);
          let subject = lineArray[0];
          let courseName = lineArray[0] + " " + lineArray[1];
          this.coursesService.getCourses({
            term: term,
            subject: subject,
            searchTerm: courseName
          }).subscribe(courses => {
            if(courses.length > 0) {
              this.transcriptReviews[courseName] = courses;
              this.keys.push(courseName);
            }
            else {
              console.error("Could not find course.");
            }
          })
        }
      }
    });
    console.log("Transcript Reviews: ", this.transcriptReviews);
    this.showTextarea = false;
  }
}
