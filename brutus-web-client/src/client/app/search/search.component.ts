import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { FormControl } from '@angular/forms';
import { Select2OptionData } from 'ng2-select2/ng2-select2';
import { CoursesService } from '../shared/courses/courses.service';
import { TermsService } from '../shared/terms/terms.service';
import { Course } from '../shared/courses/course';
import { Term } from '../shared/terms/term';
import { AuthService } from '../shared/auth/auth.service';
import { User } from '../shared/users/user';

@Component({
  moduleId: module.id,
  selector: 'search',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.css'],
})

export class SearchComponent {

    searchTerm = new FormControl();
    term: Term
    courses: Course[];
    terms: Term[];
    termNames: string[];
    factors: string[];
    subjects: any[];
    subjectSymbols: string[];
    selectedTermIndex: number;
    selectedTerm: string;
    selectedSubject: string;
    selectedFactor: string;
    skip: number;
    currentUser: User;
    calendarCourses: Course[];

    constructor(private coursesService: CoursesService, private termsService: TermsService, private auth: AuthService) {
        this.selectedTermIndex = 0;
        this.factors = ['None', 'Grade', 'Rating', 'Time'];
        this.selectedFactor = 'None';
        this.skip = 0;
        this.courses = [];
        this.currentUser = new User();
    }

    ngOnInit() {

        this.termsService.getTerms().subscribe((terms) => {
            this.terms = terms;
            this.termNames = this.terms.map(function(item) {
                return item['name'];
            });

            //Term for the calendar
            this.term = terms[this.selectedTermIndex];
            this.currentUser = this.auth.getCurrentUser();
            this.calendarCourses = this.currentUser.courses.filter(course => course.term == this.term.name);

            this.selectedTerm = terms[this.selectedTermIndex].name;
            this.subjects = terms[this.selectedTermIndex].subjects;
            this.subjectSymbols = this.subjects.map(function(item) {
                return item['symbol'];
            });
            this.subjectSymbols = ['ANY'].concat(this.subjectSymbols);
            this.selectedSubject = this.subjects[0].symbol;
        });

        this.searchTerm.valueChanges
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe(searchTerm => {
              this.skip = 0;
              this.search(searchTerm)
                .subscribe(courses => {
                  this.courses = courses;
                });
            });

    }

    private search(searchTerm: string): Observable<Course[]> {
      return this.coursesService.getCourses({
            skip: this.skip,
            searchTerm: searchTerm,
            term: this.selectedTerm,
            subject: this.selectedSubject,
            factor: this.selectedFactor
        });
    }

    private changed(e: any, filter: string): void {
        switch (filter) {
            case "factor":
                this.selectedFactor = e.value;
                break
            case "subject":
                this.selectedSubject = e.value;
                break;
            case "term":
                this.selectedTerm = e.value;
                this.term = this.terms.find(term => term.name == this.selectedTerm);
                this.calendarCourses = this.currentUser.courses.filter(course => course.term == this.term.name);
                break;
            default:
                console.error("Invalid filter")
                return
        }

        this.searchTerm.reset();
        this.skip = 0;
        let limit = this.selectedFactor &&
          this.selectedSubject &&
          (this.selectedSubject != 'ANY' || this.selectedFactor != 'None')
          ? 100 : 10;

        this.coursesService.getCourses({
            skip: this.skip,
            term: this.selectedTerm,
            subject: this.selectedSubject,
            factor: this.selectedFactor,
            limit: limit
        }).subscribe(courses => {
          if(['Grade', 'Rating', 'Time'].includes(this.selectedFactor)) {
            courses = courses.filter(course => course.score != null); //Removes courses without factor rating
            courses.sort((a, b) => Number(b.score) - Number(a.score)); //TODO: allow user to choose sort
          }
          this.courses = courses;
        });
    }

    private scrolledBottom(): void {
      console.log('bottom');
      this.skip = this.courses.length + 10;
      if(this.searchTerm.value) {
        this.search(this.searchTerm.value)
          .subscribe(courses => {
            this.courses = this.courses.concat(courses);
          });
      }
      else{
        this.coursesService.getCourses({
            skip: this.skip,
            term: this.selectedTerm,
            subject: this.selectedSubject,
            factor: this.selectedFactor
        }).subscribe(courses => {
          this.courses = this.courses.concat(courses);
        });
      }
    }

    private addToCalendar(hoverCourse: Course) {
      // Hack to get Angular change detection on array
      this.calendarCourses.push(hoverCourse);
      this.calendarCourses = this.calendarCourses.slice();
    }

    private removeFromCalendar(hoverCourse: Course) {
      // Hack to get Angular change detection on array
      this.calendarCourses.pop();
      this.calendarCourses = this.calendarCourses.slice();
    }
}
