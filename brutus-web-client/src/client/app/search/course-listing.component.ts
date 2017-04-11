import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../shared/courses/course';

@Component({
    moduleId: module.id,
    selector: 'course-listing',
    templateUrl: 'course-listing.component.html',
    styleUrls: ['course-listing.component.css']
})

export class CourseListingComponent {
    @Input() course: Course;

    constructor(private router: Router) { }

    /**
     * Go to course page
     */
    goToCourse(course: Course) {
        this.router.navigate(['/course', course._id]);
    }
}
