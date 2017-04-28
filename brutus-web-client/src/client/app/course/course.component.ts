import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CoursesService } from '../shared/courses/courses.service';
import { Course } from '../shared/courses/course';
import { ReviewsService } from '../shared/reviews/reviews.service';
import { Review } from '../shared/reviews/review';
import { UsersService } from '../shared/users/users.service';
import { User } from '../shared/users/user';
import { AuthService } from '../shared/auth/auth.service';

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

    constructor(private coursesService: CoursesService, private reviewsService: ReviewsService, private usersService: UsersService,
      private route: ActivatedRoute, private auth: AuthService) {
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
                console.log(course);

                this.reviewsService.getReviews({course: this.course._id}).subscribe(reviews => {
                  console.log(reviews);
                  this.reviews = reviews;
                });
            });
    }

    // enrolled(): boolean {
    //   let courseIds = this.currentUser.courses.map(course => {
    //     return course._id;
    //   });
    //   return courseIds.includes(this.course._id);
    // }
    //
    // addCourse() {
    //   // let currentUser = this.auth.getCurrentUser();
    //   this.currentUser.courses.push(this.course);
    //   this.usersService.updateUser(this.currentUser)
    //     .subscribe(user => {
    //       console.log('updated user: ', user);
    //       localStorage.setItem('user', JSON.stringify(this.currentUser));
    //     });
    // }
    //
    // removeCourse() {
    //   this.currentUser.courses = this.currentUser.courses.filter(course => course._id != this.course._id);
    //   this.usersService.updateUser(this.currentUser)
    //     .subscribe(user => {
    //       console.log('updated user: ', user);
    //       localStorage.setItem('user', JSON.stringify(this.currentUser));
    //     });
    // }
}
