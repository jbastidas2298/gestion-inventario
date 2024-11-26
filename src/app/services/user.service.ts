import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly ROLES_KEY = 'roles';
  private readonly USERNAME_KEY = 'username';

  setUserDetails(roles: string[], username: string) {
    localStorage.setItem(this.ROLES_KEY, JSON.stringify(roles));
    localStorage.setItem(this.USERNAME_KEY, username);
  }

  getRoles(): string[] {
    const roles = localStorage.getItem(this.ROLES_KEY);
    return roles ? JSON.parse(roles) : [];
  }

  getUsername(): string {
    return localStorage.getItem(this.USERNAME_KEY) || '';
  }

  clearUserDetails() {
    localStorage.removeItem(this.ROLES_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
  }
}
