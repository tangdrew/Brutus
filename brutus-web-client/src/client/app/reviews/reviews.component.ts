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
  }

}
