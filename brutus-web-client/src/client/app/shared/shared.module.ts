import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AUTH_PROVIDERS }      from 'angular2-jwt';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CalendarComponent } from './calendar/calendar.component';
import { NameListService } from './name-list/name-list.service';
import { AuthService } from './auth/auth.service';
import { CoursesService } from './courses/courses.service';
import { ReviewsService } from './reviews/reviews.service';
import { TermsService } from './terms/terms.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [ToolbarComponent, NavbarComponent, CalendarComponent],
  exports: [ToolbarComponent, NavbarComponent, CalendarComponent,
    CommonModule, FormsModule, RouterModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [NameListService, CoursesService, ReviewsService, TermsService, AuthService, AUTH_PROVIDERS]
    };
  }
}
