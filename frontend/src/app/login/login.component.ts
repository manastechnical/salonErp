import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../session.service';
import { ApiService } from '../api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  user = new FormGroup({
    email: new FormControl("",[Validators.required,Validators.email]),
    password: new FormControl("",[Validators.required,Validators.minLength(5),Validators.maxLength(15)]),    
  })
  
  errorMessage : string = '';

  constructor(
    private apiService: ApiService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  get Email():FormControl{
    return this.user.get("email") as FormControl;
  }

  get Password():FormControl{
    return this.user.get("password") as FormControl;
  }

  login(): void {
    this.apiService.login(this.user.value).subscribe(
      (response) => {
        if (response ) {
          this.sessionService.setSession(response.token,response.userId); // Set token in session
          this.router.navigate(['/dashboard']); // Redirect to dashboard page
        }
      },
      (error) => {
        console.error('Error occurred during login:', error);
        this.errorMessage = error;
      }
    );
  }



}


