import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, HttpClientModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatSelectModule, MatSnackBarModule
  ],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css'
})
export class InscriptionComponent {

  user = {
    nom: '',
    prenom: '',
    email: '',
    role: '',
    motDePasse: ''
  };

  confirmerMotDePasse = '';
  showPassword = false;
  showConfirm = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  inscrire() {
    if (!this.user.nom || !this.user.prenom ||
        !this.user.email || !this.user.role ||
        !this.user.motDePasse) {
      this.snackBar.open('⚠️ Veuillez remplir tous les champs !',
        'Fermer', { duration: 3000, panelClass: ['snack-warning'] });
      return;
    }

    if (!this.user.email.endsWith('@unchk.sn')) {
      this.snackBar.open('❌ Utilisez votre email institutionnel @unchk.sn',
        'Fermer', { duration: 3000, panelClass: ['snack-error'] });
      return;
    }

    if (this.user.motDePasse.length < 6) {
      this.snackBar.open('⚠️ Le mot de passe doit contenir au moins 6 caractères !',
        'Fermer', { duration: 3000, panelClass: ['snack-warning'] });
      return;
    }

    if (this.user.motDePasse !== this.confirmerMotDePasse) {
      this.snackBar.open('❌ Les mots de passe ne correspondent pas !',
        'Fermer', { duration: 3000, panelClass: ['snack-error'] });
      return;
    }

    this.http.post('http://localhost:8080/api/utilisateurs/inscription', this.user)
      .subscribe({
        next: () => {
          this.snackBar.open(`✅ Compte créé ! Bienvenue ${this.user.prenom} !`,
            'Fermer', { duration: 3000, panelClass: ['snack-success'] });
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          const msg = err.error || 'Erreur lors de l\'inscription !';
          this.snackBar.open(`❌ ${msg}`,
            'Fermer', { duration: 3000, panelClass: ['snack-error'] });
        }
      });
  }
}
