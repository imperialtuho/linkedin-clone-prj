import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}
  onSignOut() {
    this.authService.logout();
  }
}
