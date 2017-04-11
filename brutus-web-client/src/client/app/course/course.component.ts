import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CoursesService } from '../shared/courses/courses.service';
import { Course } from '../shared/courses/course';
import { ReviewsService } from '../shared/reviews/reviews.service';
import { Review } from '../shared/reviews/review';

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

    constructor(private coursesService: CoursesService, private reviewsService: ReviewsService, private route: ActivatedRoute) {
        this.course = new Course();
        this.components = [];
        this.reviews = [];
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
}
