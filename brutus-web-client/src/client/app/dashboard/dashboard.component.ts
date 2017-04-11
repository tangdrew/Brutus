import { Component } from '@angular/core';
import { CoursesService } from '../shared/courses/courses.service';
import { Course } from '../shared/courses/course';
import { TermsService } from '../shared/terms/terms.service';
import { Term } from '../shared/terms/term';

@Component({
  moduleId: module.id,
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
})

export class DashboardComponent {

    courses: Course[];
    term: Term;

    constructor(private coursesService: CoursesService, private termsService: TermsService) {}

    ngOnInit() {
      this.termsService.getTerms()
        .subscribe(terms => {
          this.term = terms[0];

          //Change to grab current users courses
          this.coursesService.getCourses({
              term: this.term.name,
              subject: 'IEMS',
            })
            .subscribe(courses => {
              this.courses = courses;
            });
        })
    }
}
