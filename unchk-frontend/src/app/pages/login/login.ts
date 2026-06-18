import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, HttpClientModule, MatSnackBarModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  email = '';
  password = '';
  showPassword = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  private redirectByRole(role: string) {
    switch (role) {
      case 'etudiant':
        this.router.navigate(['/dashboard-etudiant']);
        break;
      case 'enseignant':
      case 'tuteur':
      case 'formateur':
        this.router.navigate(['/dashboard-formateur']);
        break;
      case 'admin':
      default:
        this.router.navigate(['/dashboard']);
        break;
    }
  }

  login() {
    if (!this.email || !this.password) return;

    // ✅ POST vers le nouvel endpoint login avec BCrypt
    this.http.post<any>('http://localhost:8080/api/utilisateurs/login', {
      email: this.email,
      motDePasse: this.password
    }).subscribe({
      next: (user) => {

        // Vérifier le statut du compte
        if (user.statut === 'EN_ATTENTE') {
          this.snackBar.open(
            '⏳ Votre compte est en attente de validation par l\'administrateur !',
            'Fermer', { duration: 4000, panelClass: ['snack-warning'] }
          );
          return;
        }

        if (user.statut === 'REJETE') {
          this.snackBar.open(
            '❌ Votre compte a été rejeté. Contactez l\'administration.',
            'Fermer', { duration: 4000, panelClass: ['snack-error'] }
          );
          return;
        }

        if (user.statut === 'INACTIF' || user.actif === false) {
          this.snackBar.open(
            '🚫 Votre compte a été désactivé. Contactez l\'administration.',
            'Fermer', { duration: 4000, panelClass: ['snack-error'] }
          );
          return;
        }

        // ✅ Compte ACTIF — connexion normale
        this.authService.setUser(user);
        this.redirectByRole(user.role);
      },
      error: () => {
        // 401 = email ou mot de passe incorrect
        this.snackBar.open(
          '❌ Email ou mot de passe incorrect !',
          'Fermer', { duration: 3000, panelClass: ['snack-error'] }
        );
      }
    });
  }

  loginAs(role: string) {
    this.redirectByRole(role);
  }
}
