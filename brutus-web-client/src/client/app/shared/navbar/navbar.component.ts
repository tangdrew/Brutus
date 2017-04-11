import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
})

export class NavbarComponent {
  constructor(private auth: AuthService) {}
}
