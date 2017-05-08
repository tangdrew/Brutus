import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
})

export class NavbarComponent {
  constructor(private auth: AuthService) {}

  ngOnInit() {
    $(document).on('click','.navbar-collapse.in',(e: any) => {
      if($(e.target).is('a')) {
        $('.collapse').collapse('hide');
      }
    })
  }
}
