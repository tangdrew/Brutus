import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewsComponent } from './reviews.component';
import { ReviewsRoutingModule } from './reviews-routing.module';
import { SharedModule } from '../shared/shared.module';
import { Select2Module } from 'ng2-select2/ng2-select2';

@NgModule({
  imports: [CommonModule, ReviewsRoutingModule, SharedModule, Select2Module],
  declarations: [ReviewsComponent],
  exports: [ReviewsComponent],
  providers: []
})
export class ReviewsModule { }
