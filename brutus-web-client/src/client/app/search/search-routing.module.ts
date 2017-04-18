import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchComponent } from './search.component';
import { AuthGuard } from '../shared/auth/auth-guard.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'search', component: SearchComponent, canActivate: [AuthGuard] }
    ])
  ],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
