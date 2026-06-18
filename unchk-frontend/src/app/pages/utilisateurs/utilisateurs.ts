import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { AuthService } from '../../services/auth.service'; // ✅ AJOUT

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatTooltipModule, MatSnackBarModule,
    RouterModule, MatToolbarModule,
    SidebarComponent
  ],
  templateUrl: './utilisateurs.html',
  styleUrl: './utilisateurs.css'
})
export class UtilisateursComponent implements OnInit {

  apiUrl = 'http://localhost:8080/api/utilisateurs';
  utilisateurs: any[] = [];
  filteredUtilisateurs: any[] = [];
  showForm = false;
  editMode = false;
  searchText = '';

  roles = [
    'admin',
    'etudiant',
    'enseignant',
    'tuteur',
    'responsable',
    'administratif'
  ];

  utilisateur: any = this.emptyUtilisateur();

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private authService: AuthService // ✅ AJOUT
  ) {}

  ngOnInit() {
    this.loadUtilisateurs();
  }

  emptyUtilisateur() {
    return {
      nom: '',
      prenom: '',
      email: '',
      motDePasse: '',
      role: '',
      actif: true
    };
  }

  // ── STATS ──────────────────────────────────────────
  getActifs(): number {
    return this.utilisateurs.filter(u => u.actif === true).length;
  }

  getAdmins(): number {
    return this.utilisateurs.filter(u =>
      u.role?.toLowerCase() === 'admin' ||
      u.role?.toLowerCase() === 'administratif'
    ).length;
  }

  getEtudiants(): number {
    return this.utilisateurs.filter(u => u.role === 'etudiant').length;
  }

  getEnseignants(): number {
    return this.utilisateurs.filter(u =>
      u.role === 'enseignant' || u.role === 'tuteur'
    ).length;
  }

  // ── RECHERCHE ──────────────────────────────────────
  filterUtilisateurs() {
    const s = this.searchText.toLowerCase();
    this.filteredUtilisateurs = this.utilisateurs.filter(u =>
      u.nom?.toLowerCase().includes(s) ||
      u.prenom?.toLowerCase().includes(s) ||
      u.email?.toLowerCase().includes(s) ||
      u.role?.toLowerCase().includes(s)
    );
  }

  // ── CHARGEMENT ─────────────────────────────────────
  loadUtilisateurs() {
    this.http.get<any[]>(this.apiUrl, {
      headers: this.authService.getAuthHeaders() // ✅
    }).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.utilisateurs = [...data];
          this.filteredUtilisateurs = [...data];
          this.cdr.detectChanges();
        }, 0);
      },
      error: () => {
        this.snackBar.open('❌ Erreur de chargement !',
          'Fermer', { duration: 3000 });
      }
    });
  }

  // ── FORMULAIRE ─────────────────────────────────────
  openForm() {
    this.editMode = false;
    this.utilisateur = this.emptyUtilisateur();
    setTimeout(() => { this.showForm = true; this.cdr.detectChanges(); }, 0);
  }

  editUtilisateur(u: any) {
    this.utilisateur = { ...u };
    this.editMode = true;
    setTimeout(() => { this.showForm = true; this.cdr.detectChanges(); }, 0);
  }

  // ── SAVE ───────────────────────────────────────────
  saveUtilisateur() {
    if (!this.utilisateur.nom || !this.utilisateur.email ||
        !this.utilisateur.role) {
      this.snackBar.open('⚠️ Nom, email et rôle sont obligatoires !',
        'Fermer', { duration: 3000 });
      return;
    }

    if (!this.utilisateur.email.endsWith('@unchk.sn')) {
      this.snackBar.open('❌ Email doit être @unchk.sn !',
        'Fermer', { duration: 3000 });
      return;
    }

    const headers = this.authService.getAuthHeaders(); // ✅

    const req = this.editMode
      ? this.http.put(`${this.apiUrl}/${this.utilisateur.id}`, this.utilisateur, { headers })
      : this.http.post(this.apiUrl, this.utilisateur, { headers });

    req.subscribe({
      next: () => {
        this.showForm = false;
        this.loadUtilisateurs();
        this.snackBar.open(
          this.editMode ? '✅ Utilisateur modifié !' : '✅ Utilisateur ajouté !',
          'Fermer', { duration: 3000, panelClass: ['snack-success'] }
        );
      },
      error: (err) => {
        this.snackBar.open(
          `❌ ${err.error || 'Erreur !'}`,
          'Fermer', { duration: 3000 }
        );
      }
    });
  }

  // ── DELETE ─────────────────────────────────────────
  deleteUtilisateur(id: number) {
    this.snackBar.open('⚠️ Supprimer cet utilisateur ?', 'Supprimer', {
      duration: 5000, panelClass: ['snack-warning']
    }).onAction().subscribe(() => {
      this.http.delete(`${this.apiUrl}/${id}`, {
        headers: this.authService.getAuthHeaders() // ✅
      }).subscribe({
        next: () => {
          this.loadUtilisateurs();
          this.snackBar.open('🗑️ Utilisateur supprimé !',
            'Fermer', { duration: 3000 });
        }
      });
    });
  }

  // ── TOGGLE ACTIF ───────────────────────────────────
  toggleActif(u: any) {
    const endpoint = u.actif
      ? `${this.apiUrl}/${u.id}/desactiver`
      : `${this.apiUrl}/${u.id}/activer`;

    this.http.put(endpoint, {}, {
      headers: this.authService.getAuthHeaders() // ✅
    }).subscribe({
      next: (updated: any) => {
        u.actif = updated.actif;
        u.statut = updated.statut;
        this.snackBar.open(
          u.actif ? '✅ Compte activé !' : '⛔ Compte désactivé !',
          'Fermer', { duration: 2000 }
        );
      },
      error: () => {
        this.snackBar.open('❌ Erreur lors de la mise à jour !', 'Fermer', { duration: 3000 });
      }
    });
  }

  // ── HELPERS ────────────────────────────────────────
  getRoleClass(role: string) {
    return {
      'role-admin':         role === 'admin',
      'role-etudiant':      role === 'etudiant',
      'role-enseignant':    role === 'enseignant',
      'role-tuteur':        role === 'tuteur',
      'role-responsable':   role === 'responsable',
      'role-administratif': role === 'administratif'
    };
  }

  getRoleIcon(role: string) {
    if (role === 'admin')          return 'shield';
    if (role === 'etudiant')       return 'school';
    if (role === 'enseignant')     return 'person';
    if (role === 'tuteur')         return 'support_agent';
    if (role === 'responsable')    return 'manage_accounts';
    return 'badge';
  }

  getAvatar(u: any): string {
    return `${u.prenom?.[0] || ''}${u.nom?.[0] || ''}`.toUpperCase();
  }
}
