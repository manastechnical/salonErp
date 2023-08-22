import { Component,OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  loggedIn = false;

  constructor(private sessionService: SessionService, private router: Router) { }

  ngOnInit(): void {
    this.loggedIn = this.sessionService.isLoggedIn();
  }

  logout(): void {
    this.sessionService.logout();
    this.loggedIn = false; // Update the logged-in status
    this.router.navigateByUrl('/login');

  }

}
