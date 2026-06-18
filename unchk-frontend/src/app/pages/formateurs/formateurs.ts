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
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidebarComponent } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-formateurs',
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatTooltipModule, MatSnackBarModule, MatAutocompleteModule,
    RouterModule, MatToolbarModule, SidebarComponent  // ← ajoute ça
  ],
  templateUrl: './formateurs.html',
  styleUrl: './formateurs.css'
})
export class FormateursComponent implements OnInit {

  apiUrl = 'http://localhost:8080/api/formateurs';
  formateurs: any[] = [];
  filteredFormateurs: any[] = [];
  showForm = false;
  editMode = false;
  searchText = '';

  // Listes déroulantes
  types = [
    'Enseignant',
    'Enseignant associé',
    'Responsable de formation',
    'Tuteur'
  ];

  grades = [
    'Professeur',
    'Maître de conférences',
    'Maître assistant',
    'Assistant',
    'Docteur',
    'Ingénieur'
  ];

  formations = [
    'Informatique',
    'Gestion',
    'Mathématiques',
    'Réseaux'
  ];

  statuts = ['Actif', 'Inactif'];

  formateur: any = this.emptyFormateur();

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadFormateurs();
  }

  emptyFormateur() {
    return {
      nom: '',
      prenom: '',
      type: '',
      grade: '',
      specialite: '',
      telephone: '',
      email: '',
      formation: '',
      statut: 'Actif'
    };
  }

  // ── STATS ──────────────────────────────────────────
  getActifs(): number {
    return this.formateurs.filter(f => f.statut === 'Actif').length;
  }

  getTuteurs(): number {
    return this.formateurs.filter(f => f.type === 'Tuteur').length;
  }

  getEnseignants(): number {
    return this.formateurs.filter(f =>
      f.type === 'Enseignant' || f.type === 'Enseignant associé'
    ).length;
  }

  // ── RECHERCHE ──────────────────────────────────────
  filterFormateurs() {
    const s = this.searchText.toLowerCase();
    this.filteredFormateurs = this.formateurs.filter(f =>
      f.nom?.toLowerCase().includes(s) ||
      f.prenom?.toLowerCase().includes(s) ||
      f.type?.toLowerCase().includes(s) ||
      f.specialite?.toLowerCase().includes(s) ||
      f.formation?.toLowerCase().includes(s)
    );
  }

  // ── CHARGEMENT ─────────────────────────────────────
  loadFormateurs() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.formateurs = [...data];
          this.filteredFormateurs = [...data];
          this.cdr.detectChanges();
        }, 0);
      },
      error: () => {
        this.snackBar.open('❌ Erreur de chargement !', 'Fermer', { duration: 3000 });
      }
    });
  }

  // ── FORMULAIRE ─────────────────────────────────────
  openForm() {
    this.editMode = false;
    this.formateur = this.emptyFormateur();
    setTimeout(() => { this.showForm = true; this.cdr.detectChanges(); }, 0);
  }

  editFormateur(f: any) {
    this.formateur = { ...f };
    this.editMode = true;
    setTimeout(() => { this.showForm = true; this.cdr.detectChanges(); }, 0);
  }

  // ── SAVE ───────────────────────────────────────────
  saveFormateur() {
    const req = this.editMode
      ? this.http.put(`${this.apiUrl}/${this.formateur.id}`, this.formateur)
      : this.http.post(this.apiUrl, this.formateur);

    req.subscribe({
      next: () => {
        this.showForm = false;
        this.loadFormateurs();
        this.snackBar.open(
          this.editMode ? '✅ Formateur modifié !' : '✅ Formateur ajouté !',
          'Fermer', { duration: 3000, panelClass: ['snack-success'] }
        );
      },
      error: () => {
        this.snackBar.open('❌ Erreur lors de l\'enregistrement !', 'Fermer', { duration: 3000 });
      }
    });
  }

  // ── DELETE ─────────────────────────────────────────
  deleteFormateur(id: number) {
    this.snackBar.open('⚠️ Voulez-vous supprimer ce formateur ?', 'Supprimer', {
      duration: 5000, panelClass: ['snack-warning']
    }).onAction().subscribe(() => {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          this.loadFormateurs();
          this.snackBar.open('🗑️ Formateur supprimé !', 'Fermer', { duration: 3000 });
        }
      });
    });
  }

  // ── STATUT ─────────────────────────────────────────
  getStatutClass(statut: string) {
    return {
      'actif':   statut === 'Actif',
      'inactif': statut === 'Inactif'
    };
  }

  getStatutIcon(statut: string) {
    return statut === 'Actif' ? 'check_circle' : 'block';
  }

  // ── TYPE ICON ──────────────────────────────────────
  getTypeIcon(type: string) {
    if (type === 'Tuteur')                  return 'support_agent';
    if (type === 'Responsable de formation') return 'manage_accounts';
    if (type === 'Enseignant associé')       return 'person_add';
    return 'school';
  }
}
