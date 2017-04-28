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

    constructor(private router: Router, private el: ElementRef) { }

    enrolled(): boolean {
      let courseIds = this.currentUser.courses.map(course => {
        return course._id;
      });
      return courseIds.includes(this.course._id);
    }

    goToCourse(course: Course) {
        this.router.navigate(['/course', course._id]);
    }

    @HostListener('mouseenter') onMouseEnter() {
      this.courseEnter.emit(this.course);
    }

    @HostListener('mouseleave') onMouseLeave() {
      this.courseLeave.emit(this.course);
    }
}
