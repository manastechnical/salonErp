import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private tokenKey = 'token';
  private userIdKey = 'userId';
  logoutEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  isLoggedIn(): boolean {
    return sessionStorage.getItem(this.tokenKey) !== null;
  }

  setSession(token: string,userId:string): void {
    sessionStorage.setItem(this.tokenKey, token);
    sessionStorage.setItem(this.userIdKey, userId);
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userIdKey);
    this.logoutEvent.emit();
  }

  getLoggedInUserId(): string | null {
    return sessionStorage.getItem(this.userIdKey);
  }

}
