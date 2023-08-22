import { Component, OnInit } from '@angular/core';
import { SessionService } from './session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loggedIn = false;

  constructor(private sessionService: SessionService) { }

  ngOnInit(): void {
    this.loggedIn = this.sessionService.isLoggedIn();
  }

  logout(): void {
    this.sessionService.logout();
    this.loggedIn = false; // Update the logged-in status
  }
}
