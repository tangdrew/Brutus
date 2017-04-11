import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseComponent } from './course.component';
import { CourseRoutingModule } from './course-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [CommonModule, CourseRoutingModule, SharedModule],
  declarations: [CourseComponent],
  exports: [CourseComponent],
  providers: []
})
export class CourseModule { }
