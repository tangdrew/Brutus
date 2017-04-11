import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { FormControl } from '@angular/forms';
import { Select2OptionData } from 'ng2-select2/ng2-select2';
import { CoursesService } from '../shared/courses/courses.service';
import { TermsService } from '../shared/terms/terms.service';
import { Course } from '../shared/courses/course';
import { Term } from '../shared/terms/term';

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

    constructor(private coursesService: CoursesService, private termsService: TermsService) {
        this.selectedTermIndex = 0;
        this.factors = ['Sort By...', 'Grade', 'Rating', 'Time'];
        this.skip = 0;
        this.courses = [];
    }

    ngOnInit() {

        this.termsService.getTerms().subscribe((terms) => {
            this.terms = terms;
            this.termNames = this.terms.map(function(item) {
                return item['name'];
            });
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
                break;
            default:
                console.error("Invalid filter")
                return
        }

        this.searchTerm.reset();
        this.skip = 0;

        this.coursesService.getCourses({
            skip: this.skip,
            term: this.selectedTerm,
            subject: this.selectedSubject,
            factor: this.selectedFactor
        }).subscribe(courses => {
          this.courses = courses;
        });
    }

    private scrolledBottom(): void {
      console.log('bottom');
      this.skip = this.skip + 10;
      console.log(this.skip);
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
          console.log('courses', this.courses);
        });
      }
    }
    private onScroll(event: any): void {
      // console.log(event);
      // console.log(window.screenY);
      // console.log(document);
      // console.log(window.screenTop);
    }
}
