import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AUTH_PROVIDERS }      from 'angular2-jwt';

import { NavbarComponent } from './navbar/navbar.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AuthService } from './auth/auth.service';
import { CoursesService } from './courses/courses.service';
import { ReviewsService } from './reviews/reviews.service';
import { TermsService } from './terms/terms.service';
import { UsersService } from './users/users.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [NavbarComponent, CalendarComponent],
  exports: [NavbarComponent, CalendarComponent,
    CommonModule, FormsModule, RouterModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [CoursesService, ReviewsService, TermsService, UsersService,
        AuthService, AUTH_PROVIDERS]
    };
  }
}
