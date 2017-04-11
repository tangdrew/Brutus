import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'angular2-infinite-scroll/angular2-infinite-scroll';
import { Select2Module } from 'ng2-select2/ng2-select2';
import { CourseListingComponent } from './course-listing.component';
import { SearchComponent } from './search.component';
import { SearchRoutingModule } from './search-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [CommonModule, InfiniteScrollModule, ReactiveFormsModule, SearchRoutingModule, Select2Module, SharedModule],
  declarations: [CourseListingComponent, SearchComponent],
  exports: [CourseListingComponent, SearchComponent],
  providers: []
})
export class SearchModule { }
