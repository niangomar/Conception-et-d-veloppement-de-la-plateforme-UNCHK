import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidebarComponent } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-etudiants',
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatAutocompleteModule,
    MatTooltipModule, MatSnackBarModule, MatDatepickerModule,
    MatNativeDateModule, MatSelectModule, RouterModule,
    MatToolbarModule, SidebarComponent
  ],
  templateUrl: './etudiants.html',
  styleUrl: './etudiants.css'
})
export class EtudiantsComponent implements OnInit {

  apiUrl          = 'http://localhost:8080/api/etudiants';
  formationsUrl   = 'http://localhost:8080/api/formations';

  etudiants: any[] = [];
  filteredEtudiants: any[] = [];
  showForm = false;
  editMode = false;
  searchText = '';
  // ✅ Comparaison stricte pour mat-select
  compareString(a: string, b: string): boolean {
    return a === b;
  }

  // ✅ Chargée depuis la base de données
  formations: string[] = [];

  genres  = ['Masculin', 'Féminin'];
  statuts = ['Actif', 'Suspendu', 'Diplômé'];
  niveaux = ['L1', 'L2', 'L3', 'M1', 'M2'];

  quartiers = [
    'Yoff, Dakar', 'Pikine, Dakar', 'Guédiawaye, Dakar',
    'Thiaroye, Dakar', 'Parcelles Assainies, Dakar',
    'Médina, Dakar', 'Plateau, Dakar', 'Grand Dakar',
    'Liberté, Dakar', 'Ouakam, Dakar', 'Ngor, Dakar',
    'Almadies, Dakar', 'Sacré Coeur, Dakar', 'Mermoz, Dakar',
    'Rufisque, Dakar', 'Bargny, Dakar', 'Mbao, Dakar',
    'Keur Massar, Dakar', 'Touba', 'Thiès',
    'Saint-Louis', 'Ziguinchor', 'Kaolack', 'Mbour'
  ];

  etudiant: any = this.emptyEtudiant();
inscrits: any[] = [];
showInscrits = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadEtudiants();
    this.loadFormations(); // ✅ Charge les formations depuis la BDD
    this.loadInscrits(); // ← ajoute ça
  }

  emptyEtudiant() {
    return {
      INE: '',
      nom: '',
      prenom: '',
      dateNaissance: null,
      email: '',
      genre: '',
      formation: '',
      promo: '',
      anneeDebut: null,
      anneeSortie: null,
      diplomes: '',
      autresFormations: '',
      telephone: '',
      adresse: '',
      niveau: '',
      statut: 'Actif'
    };
  }

  // ── CHARGER FORMATIONS DEPUIS BDD ──────────────────
  loadFormations() {
    this.http.get<any[]>(this.formationsUrl).subscribe({
      next: (data) => {
        this.formations = data.map(f => f.intitule);
      },
      error: () => {
        // Si erreur, utilise une liste par défaut
        this.formations = ['Informatique', 'Gestion', 'Mathématiques', 'Réseaux'];
      }
    });
  }
// ── CHARGER INSCRITS ───────────────────────────────
loadInscrits() {
  this.http.get<any[]>('http://localhost:8080/api/utilisateurs').subscribe({
    next: (data) => {
      // Filtre juste les étudiants inscrits
      this.inscrits = data.filter(u => u.role === 'etudiant');
    },
    error: () => {
      console.log('Erreur chargement inscrits');
    }
  });
}

// ── SÉLECTIONNER UN INSCRIT ────────────────────────
selectionnerInscrit(inscrit: any) {
  this.etudiant.nom    = inscrit.nom;
  this.etudiant.prenom = inscrit.prenom;
  this.etudiant.email  = inscrit.email;
  this.showInscrits    = false;

  this.snackBar.open(
    `✅ ${inscrit.prenom} ${inscrit.nom} sélectionné !`,
    'Fermer', { duration: 2000 }
  );
}

  // ── STATS FORMATION ────────────────────────────────
  // ── STATS ──────────────────────────────────────────
  getActifs(): number {
    return this.etudiants.filter((e: any) => e.statut === 'Actif').length;
  }
  getSansFormation(): number {
    return this.etudiants.filter(e =>
      !e.formation || e.formation === ''
    ).length;
  }

  getAvecFormation(): number {
    return this.etudiants.filter(e =>
      e.formation && e.formation !== ''
    ).length;
  }

  // ── ASSIGNER FORMATION RAPIDE ──────────────────────
 assignerFormation(etudiant: any, formation: string) {
   if (!formation) return; // ← ajoute juste cette ligne
   etudiant.formation = formation;
   this.http.put(`${this.apiUrl}/${etudiant.id}`, etudiant).subscribe({
     next: () => {
       this.loadEtudiants();
       this.snackBar.open(
         `✅ Formation "${formation}" assignée à ${etudiant.prenom} !`,
         'Fermer', { duration: 3000, panelClass: ['snack-success'] }
       );
     },
     error: () => {
       this.snackBar.open('❌ Erreur lors de l\'assignation !',
         'Fermer', { duration: 3000 });
     }
   });
 }
  // ── RECHERCHE ──────────────────────────────────────
  filterEtudiants() {
    const s = this.searchText.toLowerCase();
    this.filteredEtudiants = this.etudiants.filter((e: any) =>
      e.nom?.toLowerCase().includes(s) ||
      e.prenom?.toLowerCase().includes(s) ||
      e.INE?.toLowerCase().includes(s) ||
        e.ine?.toLowerCase().includes(s) || // ← ajoute ça
      e.formation?.toLowerCase().includes(s) ||
      e.adresse?.toLowerCase().includes(s)
    );
  }

  // ── CHARGEMENT ─────────────────────────────────────
  loadEtudiants() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.etudiants = [...data];
          this.filteredEtudiants = [...data];
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
    this.etudiant = this.emptyEtudiant();
    setTimeout(() => { this.showForm = true; this.cdr.detectChanges(); }, 0);
  }

 editEtudiant(e: any) {
   this.etudiant = { ...e };
   this.editMode = true;
   setTimeout(() => {
     this.etudiant = { ...e }; // ✅ Double assignation pour forcer mat-select
     this.showForm = true;
     this.cdr.detectChanges();
   }, 0);
 }

  // ── SAVE ───────────────────────────────────────────
 saveEtudiant() {
   if (!this.etudiant.nom || !this.etudiant.prenom) {
     this.snackBar.open('⚠️ Nom et prénom sont obligatoires !',
       'Fermer', { duration: 3000 });
     return;
   }

   // ✅ Convertit la date avant envoi
   const payload = { ...this.etudiant };
   if (payload.dateNaissance) {
     const d = new Date(payload.dateNaissance);
     payload.dateNaissance = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
   }

   const req = this.editMode
     ? this.http.put(`${this.apiUrl}/${this.etudiant.id}`, payload)
     : this.http.post(this.apiUrl, payload);

   req.subscribe({
     next: () => {
       this.showForm = false;
       this.loadEtudiants();
       this.snackBar.open(
         this.editMode ? '✅ Étudiant modifié !' : '✅ Étudiant ajouté !',
         'Fermer', { duration: 3000, panelClass: ['snack-success'] }
       );
     },
     error: () => {
       this.snackBar.open('❌ Erreur lors de l\'enregistrement !',
         'Fermer', { duration: 3000 });
     }
   });
 }
  // ── DELETE ─────────────────────────────────────────
  deleteEtudiant(id: number) {
    this.snackBar.open('⚠️ Voulez-vous supprimer cet étudiant ?', 'Supprimer', {
      duration: 5000, panelClass: ['snack-warning']
    }).onAction().subscribe(() => {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          this.loadEtudiants();
          this.snackBar.open('🗑️ Étudiant supprimé !',
            'Fermer', { duration: 3000 });
        }
      });
    });
  }

  // ── STATUT ─────────────────────────────────────────
  getStatutClass(statut: string) {
    return {
      'actif':    statut === 'Actif',
      'suspendu': statut === 'Suspendu',
      'diplome':  statut === 'Diplômé'
    };
  }

  getStatutIcon(statut: string) {
    if (statut === 'Actif')    return 'check_circle';
    if (statut === 'Suspendu') return 'block';
    return 'school';
  }
}
