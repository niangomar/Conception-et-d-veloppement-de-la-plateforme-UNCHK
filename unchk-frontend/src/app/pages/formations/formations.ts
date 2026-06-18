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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidebarComponent } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-formations',
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatTooltipModule, MatSnackBarModule,
    MatDatepickerModule, MatNativeDateModule,
    RouterModule, MatToolbarModule, SidebarComponent
  ],
  templateUrl: './formations.html',
  styleUrl: './formations.css'
})
export class FormationsComponent implements OnInit {

  apiUrl = 'http://localhost:8080/api/formations';

  formations: any[] = [];
  filteredFormations: any[] = [];
  showForm = false;
  editMode = false;
  searchText = '';

  // ── STATS DYNAMIQUES ───────────────────────────────
  statsEnCours: number = 0;
  statsTerminees: number = 0;
  statsPlanifiees: number = 0;
  statsTotalFormes: number = 0;

  // ── LISTES DÉROULANTES ─────────────────────────────
  types = [
    'Licence',
    'Master',
    'Certification',
    'Formation privée',
    'Formation continue'
  ];

  niveaux = ['L1', 'L2', 'L3', 'M1', 'M2'];

  typesFinancement = ['Public', 'Privé', 'Bourse', 'Certification'];

  statuts = ['Planifiée', 'En cours', 'Terminée'];

  formation: any = this.emptyFormation();

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadFormations();
    this.loadStats();
  }

  emptyFormation() {
    return {
      intitule: '',
      type: '',
      niveau: '',
      dateDebut: null,
      dateFin: null,
      nombreHommes: null,
      nombreFemmes: null,
      montantFinancement: null,
      typeFinancement: '',
      statut: 'Planifiée',
      description: ''
    };
  }

  // ── CHARGEMENT FORMATIONS ──────────────────────────
  loadFormations() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.formations = [...data];
          this.filteredFormations = [...data];
          this.cdr.detectChanges();
        }, 0);
      },
      error: () => {
        this.snackBar.open('❌ Erreur de chargement !', 'Fermer', { duration: 3000 });
      }
    });
  }

  // ── CHARGEMENT STATS DEPUIS API ────────────────────
  loadStats() {
    this.http.get<number>(`${this.apiUrl}/stats/en-cours`).subscribe({
      next: (val) => { this.statsEnCours = val; this.cdr.detectChanges(); },
      error: () => { this.statsEnCours = 0; }
    });

    this.http.get<number>(`${this.apiUrl}/stats/terminees`).subscribe({
      next: (val) => { this.statsTerminees = val; this.cdr.detectChanges(); },
      error: () => { this.statsTerminees = 0; }
    });

    this.http.get<number>(`${this.apiUrl}/stats/planifiees`).subscribe({
      next: (val) => { this.statsPlanifiees = val; this.cdr.detectChanges(); },
      error: () => { this.statsPlanifiees = 0; }
    });

    this.http.get<number>(`${this.apiUrl}/stats/total-formes`).subscribe({
      next: (val) => { this.statsTotalFormes = val; this.cdr.detectChanges(); },
      error: () => { this.statsTotalFormes = 0; }
    });
  }

  // ── RECHERCHE ──────────────────────────────────────
  filterFormations() {
    const s = this.searchText.toLowerCase();
    this.filteredFormations = this.formations.filter(f =>
      f.intitule?.toLowerCase().includes(s) ||
      f.type?.toLowerCase().includes(s) ||
      f.niveau?.toLowerCase().includes(s) ||
      f.statut?.toLowerCase().includes(s)
    );
  }

  // ── FORMULAIRE ─────────────────────────────────────
  openForm() {
    this.editMode = false;
    this.formation = this.emptyFormation();
    setTimeout(() => { this.showForm = true; this.cdr.detectChanges(); }, 0);
  }

  editFormation(f: any) {
    this.formation = { ...f };
    this.editMode = true;
    setTimeout(() => { this.showForm = true; this.cdr.detectChanges(); }, 0);
  }

  // ── SAVE ───────────────────────────────────────────
  saveFormation() {
    if (!this.formation.intitule || !this.formation.type) {
      this.snackBar.open('⚠️ Intitulé et type sont obligatoires !',
        'Fermer', { duration: 3000 });
      return;
    }

    const req = this.editMode
      ? this.http.put(`${this.apiUrl}/${this.formation.id}`, this.formation)
      : this.http.post(this.apiUrl, this.formation);

    req.subscribe({
      next: () => {
        this.showForm = false;
        this.loadFormations();
        this.loadStats();
        this.snackBar.open(
          this.editMode ? '✅ Formation modifiée !' : '✅ Formation ajoutée !',
          'Fermer', { duration: 3000, panelClass: ['snack-success'] }
        );
      },
      error: () => {
        this.snackBar.open('❌ Erreur lors de l\'enregistrement !',
          'Fermer', { duration: 3000, panelClass: ['snack-error'] });
      }
    });
  }

  // ── DELETE ─────────────────────────────────────────
  deleteFormation(id: number) {
    this.snackBar.open('⚠️ Voulez-vous supprimer cette formation ?',
      'Supprimer', { duration: 5000, panelClass: ['snack-warning'] }
    ).onAction().subscribe(() => {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          this.loadFormations();
          this.loadStats();
          this.snackBar.open('🗑️ Formation supprimée !',
            'Fermer', { duration: 3000 });
        }
      });
    });
  }

  // ── STATUT ─────────────────────────────────────────
  getStatutClass(statut: string) {
    return {
      'en-cours':  statut === 'En cours',
      'terminee':  statut === 'Terminée',
      'planifiee': statut === 'Planifiée'
    };
  }

  getStatutIcon(statut: string) {
    if (statut === 'En cours') return 'play_circle';
    if (statut === 'Terminée') return 'check_circle';
    return 'schedule';
  }

  // ── TOTAL FORMÉS PAR FORMATION ─────────────────────
  getTotal(f: any): number {
    return (f.nombreHommes || 0) + (f.nombreFemmes || 0);
  }
}
