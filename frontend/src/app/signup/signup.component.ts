import { environment } from '../../environments/environment';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../api.service';

// const signUpUrl = `${environment.apiUrl}/signup`;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
  // user = {
  //   email: '',
  //   password: '',
  //   name: '',
  //   mobile: '',
  //   gstNo:''
  // };

  user = new FormGroup({
    email: new FormControl("",[Validators.required,Validators.email]),
    password: new FormControl("",[Validators.required,Validators.minLength(5),Validators.maxLength(15)]),
    name: new FormControl("",[Validators.required,Validators.minLength(3),Validators.pattern("[a-zA-Z].*")]),
    mobile: new FormControl("",[Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern("[0-9]*")]),
    gstNo: new FormControl("",[Validators.required,Validators.minLength(15),Validators.maxLength(15),Validators.pattern("^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$")])
  })

  errorMessage : string = '';

  constructor(private apiService: ApiService,private http: HttpClient, private router: Router) {}

  get Name():FormControl{
    return this.user.get("name") as FormControl;
  }
  get Mobile():FormControl{
    return this.user.get("mobile") as FormControl;
  }
  get GstNo():FormControl{
    return this.user.get("gstNo") as FormControl;
  }
  get Email():FormControl{
    return this.user.get("email") as FormControl;
  }
  get Password():FormControl{
    return this.user.get("password") as FormControl;
  }

  onSubmit() {
    this.apiService.signup(this.user.value).subscribe(
      (response) => {
        // Handle successful registration
        console.log('User registered successfully');
        this.router.navigate(['/login']); // Redirect to login page
      },
      (error) => {
        // Handle registration error
        console.error('Error occurred during registration:', error);
        this.errorMessage = error; // Assign the error message

      }
    );
  }


}
