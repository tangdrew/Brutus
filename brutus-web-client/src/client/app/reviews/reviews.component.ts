import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
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
import { Select2OptionData } from 'ng2-select2/ng2-select2';

@Component({
    moduleId: module.id,
    selector: 'reviews',
    templateUrl: 'reviews.component.html',
    styleUrls: ['reviews.component.css'],
})

export class ReviewsComponent {
  term: Term
  courses: Course[];
  terms: Term[];
  termNames: string[];
  subjects: any[];
  subjectSymbols: string[];
  selectedTermIndex: number;
  selectedTerm: string;
  selectedSubject: string;
  skip: number;
  currentUser: User;
  review: Review
  course: Course
  courseNames: string[]
  number: number
  text: string
  ctecReview: Review
  ctecReviewString: string

  constructor(private coursesService: CoursesService, private termsService: TermsService,
      private reviewsService: ReviewsService, private auth: AuthService) {
      this.selectedTermIndex = 0;
      this.skip = 0;
      this.courses = [];
      this.currentUser = new User();
      this.review = new Review();
      this.number = 0;
  }

  ngOnInit() {
      //Admin stuff
      this.termsService.getTerms().subscribe((terms) => {
          this.terms = terms;
          this.termNames = this.terms.map(function(item) {
              return item['name'];
          });

          //Term for the calendar
          this.term = terms[this.selectedTermIndex];
          this.currentUser = this.auth.getCurrentUser();

          this.selectedTerm = terms[this.selectedTermIndex].name;
          this.subjects = terms[this.selectedTermIndex].subjects;
          this.subjectSymbols = this.subjects.map(function(item) {
              return item['symbol'];
          });
          this.selectedSubject = this.subjects[0].symbol;
      });
  }

  private changed(e: any, filter: string): void {
      switch (filter) {
          case "subject":
              this.selectedSubject = e.value;
              break;
          case "term":
              this.selectedTerm = e.value;
              this.term = this.terms.find(term => term.name == this.selectedTerm);
              break;
          case "course":
              let n = e.value.lastIndexOf(':');
              let result = e.value.substring(n + 1);
              this.course = this.courses.find(course => course.course_id == result);
              console.log(this.course);
              break;
          default:
              console.error("Invalid filter")
              return
      }

      this.skip = 0;

      this.coursesService.getCourses({
          skip: this.skip,
          limit: 100,
          term: this.selectedTerm,
          subject: this.selectedSubject
      }).subscribe(courses => {
        this.courses = courses;
        this.courseNames = this.courses.map((course: Course) => course.catalog_num + ": " + course.title + " with "
          + course.instructor.name + " ID:" + course.course_id)
      });
  }

  submitReview() {
    this.review.course = this.course.id;
    this.review.course_id = this.course.course_id;
    this.review.instructor = this.course.instructor.name;
    this.review.user = this.currentUser._id;
    for(let i = 0; i < this.number; i++) {
      this.reviewsService.createReview(this.review).subscribe(res => {
        console.log(res);
      });
    }
    this.review.rating = null;
    this.review.time = null;
    this.number = null;
  }

  //CTEC Parsing
  private search(searchTerm: string, term: string, subject: string): Observable<Course[]> {
    return this.coursesService.getCourses({
          skip: 0,
          searchTerm: searchTerm,
          term: term,
          subject: subject
      });
  }

  private parse() {
    let textArray = this.text.split("\n");
    let titleLine = textArray[2];
    let subject = titleLine.split("_")[0];
    let catalog_num = titleLine.split("_")[1];
    let last_name = titleLine.split(" ")[titleLine.split(" ").length - 1];
    let termLine = textArray[3];
    let quarter = termLine.split(" ")[termLine.split(" ").length - 2]
    let year = termLine.split(" ")[termLine.split(" ").length - 1];
    let responsesLine = textArray[5];
    let responses = parseFloat(responsesLine.split(" ")[responsesLine.split(" ").length - 1]);
    let ratingLine = textArray[21].replace(/\s+/g,' ');
    let rating = parseFloat(ratingLine.split(" ")[ratingLine.split(" ").length - 1]);
    let time3Line = textArray[47].replace(/\s+/g,' ').split(" ");
    let time4to7Line = textArray[48].replace(/\s+/g,' ').split(" ");
    let time8to11Line = textArray[49].replace(/\s+/g,' ').split(" ");
    let time12to15Line = textArray[50].replace(/\s+/g,' ').split(" ");
    let time16to19Line = textArray[51].replace(/\s+/g,' ').split(" ");
    let time20orMoreLine = textArray[52].replace(/\s+/g,' ').split(" ");
    let time = (3 * parseFloat(time3Line[time3Line.length - 2]) +
               5.5 * parseFloat(time4to7Line[time4to7Line.length - 2]) +
               9.5 * parseFloat(time8to11Line[time8to11Line.length - 2]) +
               13.5 * parseFloat(time12to15Line[time12to15Line.length - 2]) +
               17.5 * parseFloat(time16to19Line[time16to19Line.length - 2]) +
               20 * parseFloat(time20orMoreLine[time20orMoreLine.length - 2])) /
               responses;

    this.search(subject+catalog_num, year+' '+quarter, subject).subscribe((courses: Course[]) => {
      let course = courses.find(c => c.instructor.name.includes(last_name));
      this.ctecReview = new Review();
      this.ctecReview.course = course.id;
      this.ctecReview.course_id = course.course_id;
      this.ctecReview.instructor = course.instructor.name;
      this.ctecReview.user = this.currentUser._id;
      this.ctecReview.rating = rating;
      this.ctecReview.time = time;
      this.number = responses;
      this.ctecReviewString = JSON.stringify(this.ctecReview, null, ' ');
    })
  }

  submitCtecReview(review: Review) {
    for(let i = 0; i < this.number; i++) {
      this.reviewsService.createReview(review).subscribe(res => {
        console.log(res);
      });
    }
    this.ctecReview = null;
    this.ctecReviewString = null;
    this.number = null;
    this.text = null;
  }

}
