import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../shared/courses/course';
import { AuthService } from '../shared/auth/auth.service';
import { User } from '../shared/users/user';

@Component({
    moduleId: module.id,
    selector: 'course-listing',
    templateUrl: 'course-listing.component.html',
    styleUrls: ['course-listing.component.css']
})

export class CourseListingComponent {
    @Input() course: Course
    @Output() courseEnter = new EventEmitter<Course>()
    @Output() courseLeave = new EventEmitter<Course>()
    currentUser: User

    constructor(private auth: AuthService, private router: Router, private el: ElementRef) { }

    addCourse(e: Event) {
      this.auth.addCourse(this.course);
      e.stopPropagation();
    }

    removeCourse(e: Event) {
      this.auth.removeCourse(this.course);
      e.stopPropagation();
    }

    goToCourse(course: Course) {
        this.router.navigate(['/course', course.id]);
    }

    @HostListener('mouseenter') onMouseEnter() {
      this.courseEnter.emit(this.course);
    }

    @HostListener('mouseleave') onMouseLeave() {
      this.courseLeave.emit(this.course);
    }
}
