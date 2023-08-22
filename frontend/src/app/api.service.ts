import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
  export class ApiService {
    
    // API base URL
   // private baseUrl = 'https://nakodabackend.ngrok.app';
    private baseUrl = 'http://localhost:3002';

    constructor(private http: HttpClient) { }
    
    // Define your API methods here

    signup(userData: any): Observable<any> {
        const url = `${this.baseUrl}/signup`;
        return this.http.post<any>(url, userData)
          .pipe(
            catchError(this.handleError)
          );
      }
      
      login(credentials: any): Observable<any> {
        const url = `${this.baseUrl}/login`;
        return this.http.post<any>(url, credentials)
          .pipe(
            catchError(this.handleError)
          );
      }

      getUserData(userId: string): Observable<any> {
        const url = `${this.baseUrl}/api/user/${userId}`;
        return this.http.get<any>(url)
          .pipe(
            catchError(this.handleError)
          );
      }

      // Handle HTTP errors
      private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An error occurred';
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          errorMessage = error.status + ' - ' + error.error.message;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
      }
      
    
  }
  

  