import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CoursesService } from '../shared/courses/courses.service';
import { Course } from '../shared/courses/course';
import { ReviewsService } from '../shared/reviews/reviews.service';
import { Review } from '../shared/reviews/review';
import { UsersService } from '../shared/users/users.service';
import { User } from '../shared/users/user';
import { AuthService } from '../shared/auth/auth.service';

declare var moment: any;

@Component({
    moduleId: module.id,
    selector: 'course',
    templateUrl: 'course.component.html',
    styleUrls: ['course.component.css'],
})

export class CourseComponent {
    course: Course;
    components: any[];
    reviews: Review[];
    currentUser: User;
    selectedComponentIndex: number;
    arr: number[];

    constructor(private coursesService: CoursesService, private reviewsService: ReviewsService, private usersService: UsersService,
      private route: ActivatedRoute, private auth: AuthService) {
        this.arr = Array;
        this.course = new Course();
        this.components = [];
        this.reviews = [];
        this.currentUser = this.auth.getCurrentUser();
    }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.coursesService.getCourse(params['id']))
            .subscribe((course: Course) => {
                this.course = course;
                this.components = course.course_component;

                this.reviewsService.getReviews({course: this.course.id}).subscribe(reviews => {
                  this.reviews = reviews.map(review => {
                    review.created_at = moment(review.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a");
                    return review;
                  });
                });
            });
    }

    addCourse() {
      if(this.course.course_components.length > 0) {
        console.log(this.selectedComponentIndex);
        if(typeof this.selectedComponentIndex == 'number') {
          this.course.componentIndex = this.selectedComponentIndex;
          this.auth.addCourse(this.course);
        }
        else {
          alert('Need to select a component');
        }
      }
      else {
        this.auth.addCourse(this.course);
      }
    }

    removeCourse() {
      this.auth.removeCourse(this.course);
    }

    onSelectionChange(entry: number) {
      console.log(entry);
      this.selectedComponentIndex = entry;
    }

}
