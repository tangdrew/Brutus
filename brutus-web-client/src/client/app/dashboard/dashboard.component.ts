import { Component } from '@angular/core';
import { CoursesService } from '../shared/courses/courses.service';
import { Course } from '../shared/courses/course';
import { TermsService } from '../shared/terms/terms.service';
import { Term } from '../shared/terms/term';
import { User } from '../shared/users/user';
import { AuthService } from '../shared/auth/auth.service';
import { TermTabsComponent } from '../shared/terms/term-tabs.component';

@Component({
  moduleId: module.id,
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
})

export class DashboardComponent {

    courses: Course[];
    term: Term;
    terms: Term[];
    currentUser: User;

    constructor(private coursesService: CoursesService, private termsService: TermsService, private auth: AuthService) {}

    ngOnInit() {
      this.currentUser = this.auth.getCurrentUser();

      this.termsService.getTerms()
        .subscribe(terms => {
          this.term = terms[0];
          this.courses = this.currentUser.courses.filter(course => course.term == this.term.name);
          this.terms = terms.filter(term => {
            return this.currentUser.courses.map(course => course.term).includes(term.name);
          });
          console.log(this.courses);
        })
    }

    activateTerm(term: Term) {
      this.term = term;
      this.courses = this.currentUser.courses.filter(course => course.term == this.term.name);
    }
}
