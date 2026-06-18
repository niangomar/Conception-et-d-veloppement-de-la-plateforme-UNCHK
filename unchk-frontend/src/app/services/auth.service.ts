import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUser: any = null;

  constructor(private router: Router) {}

  setUser(user: any) {
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    // Toujours lire depuis localStorage
    const stored = localStorage.getItem('user');
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }
    return null;
  }

  getUserNom(): string {
    const user = this.getUser();
    return user ? `${user.prenom} ${user.nom}` : 'Utilisateur';
  }

  getUserRole(): string {
    const user = this.getUser();
    return user ? user.role : '';
  }

getAuthHeaders(): { [key: string]: string } {
    const user = this.getUser();
    if (!user) return {};
    return {
        'X-User-Email': user.email,
        'X-User-Role': user.role
    };
}
  logout() {
    this.currentUser = null;
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }
}
