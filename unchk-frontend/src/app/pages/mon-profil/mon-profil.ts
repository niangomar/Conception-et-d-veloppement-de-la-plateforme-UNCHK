import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  actif: boolean;
  createdAt: string;
}

interface Etudiant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  INE: string;
  formation: string;
  niveau: string;
  promo: string;
  statut: string;
  telephone: string;
  adresse: string;
  dateNaissance: string;
  anneeDebut: number;
  anneeSortie: number;
  diplomes: string;
  autresFormations: string;
  genre: string;
}

interface Formateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  specialite: string;
  grade: string;
  telephone: string;
  statut: string;
}

@Component({
  selector: 'app-mon-profil',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, HttpClientModule],
  templateUrl: './mon-profil.html',
  styleUrl: './mon-profil.css',
})
export class MonProfil implements OnInit {

  utilisateur: Utilisateur | null = null;
  etudiant: Etudiant | null = null;
  formateur: Formateur | null = null;
  chargement = true;

  private apiUrl        = 'http://localhost:8080/api/utilisateurs';
  private etudiantsUrl  = 'http://localhost:8080/api/etudiants';
  private formateursUrl = 'http://localhost:8080/api/formateurs';

  // Cache en mémoire pour éviter les rechargements
  private static cacheUtilisateur: Utilisateur | null = null;
  private static cacheEtudiant: Etudiant | null = null;
  private static cacheFormateur: Formateur | null = null;
  private static cacheUserId: number | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const userLocal = this.authService.getUser();

    if (!userLocal?.id) {
      this.utilisateur = userLocal;
      this.chargement = false;
      return;
    }

    // Retour instantané si déjà en cache
    if (MonProfil.cacheUserId === userLocal.id && MonProfil.cacheUtilisateur) {
      this.utilisateur = MonProfil.cacheUtilisateur;
      this.etudiant    = MonProfil.cacheEtudiant;
      this.formateur   = MonProfil.cacheFormateur;
      this.chargement  = false;
      return;
    }

    this.chargerProfilComplet(userLocal.id);
  }

  chargerProfilComplet(id: number) {
    this.chargement = true;

    this.http.get<Utilisateur>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of(this.authService.getUser() as Utilisateur))
    ).subscribe(utilisateur => {
      this.utilisateur = utilisateur;
      MonProfil.cacheUtilisateur = utilisateur;
      MonProfil.cacheUserId = id;

      const role = utilisateur?.role?.toLowerCase();

      if (role === 'etudiant') {
        this.http.get<Etudiant>(`${this.etudiantsUrl}/email/${utilisateur.email}`).pipe(
          catchError(() => of(null))
        ).subscribe(etudiant => {
          this.etudiant = etudiant;
          MonProfil.cacheEtudiant = etudiant;
          this.chargement = false;
        });

      } else if (role === 'enseignant' || role === 'formateur') {
        this.http.get<Formateur>(`${this.formateursUrl}/email/${utilisateur.email}`).pipe(
          catchError(() => of(null))
        ).subscribe(formateur => {
          this.formateur = formateur;
          MonProfil.cacheFormateur = formateur;
          this.chargement = false;
        });

      } else {
        this.chargement = false;
      }
    });
  }

  // Méthode pour forcer le rechargement (ex: bouton "Actualiser")
  recharger() {
    MonProfil.cacheUtilisateur = null;
    MonProfil.cacheEtudiant    = null;
    MonProfil.cacheFormateur   = null;
    MonProfil.cacheUserId      = null;
    const userLocal = this.authService.getUser();
    if (userLocal?.id) this.chargerProfilComplet(userLocal.id);
  }

  getInitiales(): string {
    if (!this.utilisateur) return '??';
    return `${this.utilisateur.prenom?.[0] || ''}${this.utilisateur.nom?.[0] || ''}`.toUpperCase();
  }

  getRoleLabel(): string {
    const roles: { [key: string]: string } = {
      'etudiant':      'Étudiant',
      'enseignant':    'Formateur',
      'formateur':     'Formateur',
      'tuteur':        'Tuteur',
      'responsable':   'Responsable',
      'admin':         'Administrateur',
      'administratif': 'Administratif'
    };
    const role = this.utilisateur?.role?.toLowerCase() || '';
    return roles[role] || this.utilisateur?.role || '';
  }

  getRoleClass(): string {
    const role = this.utilisateur?.role?.toLowerCase() || '';
    if (role === 'enseignant') return 'formateur';
    return role || 'etudiant';
  }

  formaterDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }

  isEtudiant(): boolean {
    return this.utilisateur?.role?.toLowerCase() === 'etudiant';
  }

  isFormateur(): boolean {
    const role = this.utilisateur?.role?.toLowerCase();
    return role === 'enseignant' || role === 'formateur';
  }
}
