import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isDropdownOpen: boolean = false;
  logoUrl: string = '';
  userName: string = '';
  userPosition: string = '';
  userEmail: string = '';
  isLoggedIn: boolean = false;

  constructor(
    private apiService: ApiService,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.sessionService.isLoggedIn();
    this.sessionService.logoutEvent.subscribe(() => {
      this.isLoggedIn = false;
    });

    if (this.isLoggedIn) {
    const loggedInUserId = this.sessionService.getLoggedInUserId();
    if (loggedInUserId) {
      this.fetchSalonData(loggedInUserId);
    }
  }

  }

  fetchSalonData(userId: string): void {
    this.apiService.getUserData(userId).subscribe(
      data => {
        // this.logoUrl = data.logo_url;
        if(data.logoBase64){
          this.logoUrl = `data:image/png;base64,${data.logoBase64}`
        }else{
          this.logoUrl = 'https://i.ibb.co/9VyDbdf/logo-Default.png';
        }
        this.userName = data.name;
        this.userPosition = data.position;
        this.userEmail = data.email;
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  openUserProfile(): void {
    // Add logic to open user profile
  }

  logout(): void {
    this.sessionService.logout();
    // Add logic to navigate to login page
  }

  updateHeaderVisibility(): void {
    // This function will update the visibility of the header content
    // based on the login status
  }
}
