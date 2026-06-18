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
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-comptes-rendus',
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatTooltipModule, MatSnackBarModule,
    MatDatepickerModule, MatNativeDateModule,
    MatToolbarModule, RouterModule,
    SidebarComponent
  ],
  templateUrl: './comptes-rendus.html',
  styleUrl: './comptes-rendus.css'
})
export class ComptesRendusComponent implements OnInit {

  apiUrl = 'http://localhost:8080/api/comptes-rendus';

  comptesRendus: any[] = [];
  filteredComptesRendus: any[] = [];

  showForm = false;
  editMode = false;
  searchText = '';
  currentFilter = '';

  types = ['Réunion', 'Rencontre', 'Séminaire', 'Webinaire', "Conseil d'Université"];
  rolesAcces = ['Tous', 'Admin', 'Enseignant', 'Etudiant'];
  statuts = ['Actif', 'Archivé'];

  compteRendu: any = this.emptyCompteRendu();

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadComptesRendus();
  }

  emptyCompteRendu() {
    return {
      titre: '',
      type: '',
      dateSeance: null,
      lieu: '',
      participants: '',
      contenu: '',
      roleAcces: 'Tous',
      statut: 'Actif'
    };
  }

  // ── STATS ──────────────────────────────────────────
  getActifs(): number {
    return this.comptesRendus.filter(c => c.statut === 'Actif').length;
  }

  getArchives(): number {
    return this.comptesRendus.filter(c => c.statut === 'Archivé').length;
  }

  getCount(type: string): number {
    return this.comptesRendus.filter(c => c.type === type).length;
  }

  // ── ICONES / COULEURS ──────────────────────────────
  getTypeIcon(type: string): string {
    if (type === 'Réunion')              return 'groups';
    if (type === 'Rencontre')             return 'handshake';
    if (type === 'Séminaire')             return 'school';
    if (type === 'Webinaire')             return 'videocam';
    if (type === "Conseil d'Université")  return 'account_balance';
    return 'description';
  }

  getTypeColor(type: string): string {
    if (type === 'Réunion')              return 'bleu';
    if (type === 'Rencontre')             return 'vert';
    if (type === 'Séminaire')             return 'orange';
    if (type === 'Webinaire')             return 'violet';
    if (type === "Conseil d'Université")  return 'rouge';
    return 'gris';
  }

  // ── FILTRES ────────────────────────────────────────
  filterType(type: string) {
    this.currentFilter = type;
    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.comptesRendus];

    if (this.currentFilter) {
      result = result.filter(c => c.type === this.currentFilter);
    }

    if (this.searchText) {
      const s = this.searchText.toLowerCase();
      result = result.filter(c =>
        c.titre?.toLowerCase().includes(s) ||
        c.type?.toLowerCase().includes(s) ||
        c.lieu?.toLowerCase().includes(s) ||
        c.contenu?.toLowerCase().includes(s)
      );
    }

    this.filteredComptesRendus = result;
  }

  filterSearch() {
    this.applyFilters();
  }

  // ── CHARGEMENT ─────────────────────────────────────
  loadComptesRendus() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.comptesRendus = data;
        this.filteredComptesRendus = [...data];
        this.cdr.detectChanges(); // ← ajoute cette ligne
      },
      error: () => {
        this.snackBar.open('❌ Erreur de chargement !', 'Fermer', { duration: 3000 });
      }
    });
  }

  // ── FORMULAIRE ─────────────────────────────────────
  openForm() {
    this.editMode = false;
    this.compteRendu = this.emptyCompteRendu();
    this.showForm = true;
  }

  editCompteRendu(c: any) {
    this.compteRendu = { ...c };
    this.editMode = true;
    this.showForm = true;
  }

  // ── SAVE ───────────────────────────────────────────
  saveCompteRendu() {
    if (!this.compteRendu.titre || !this.compteRendu.type) {
      this.snackBar.open('⚠️ Titre et type sont obligatoires !',
        'Fermer', { duration: 3000 });
      return;
    }

    const req = this.editMode
      ? this.http.put(`${this.apiUrl}/${this.compteRendu.id}`, this.compteRendu)
      : this.http.post(this.apiUrl, this.compteRendu);

    req.subscribe({
      next: () => {
        this.showForm = false;
        this.loadComptesRendus();
        this.snackBar.open(
          this.editMode ? '✅ Compte rendu modifié !' : '✅ Compte rendu ajouté !',
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
  deleteCompteRendu(id: number) {
    this.snackBar.open('⚠️ Supprimer ce compte rendu ?', 'Supprimer', {
      duration: 5000, panelClass: ['snack-warning']
    }).onAction().subscribe(() => {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          this.loadComptesRendus();
          this.snackBar.open('🗑️ Compte rendu supprimé !',
            'Fermer', { duration: 3000 });
        }
      });
    });
  }

  // ── ARCHIVER ───────────────────────────────────────
  archiverCompteRendu(id: number) {
    this.http.put(`${this.apiUrl}/${id}/archiver`, {}).subscribe({
      next: () => {
        this.loadComptesRendus();
        this.snackBar.open('📦 Compte rendu archivé !',
          'Fermer', { duration: 3000 });
      }
    });
  }

  // ── STATUT ─────────────────────────────────────────
  getStatutClass(statut: string) {
    return {
      'actif':   statut === 'Actif',
      'archive': statut === 'Archivé'
    };
  }

  getStatutIcon(statut: string): string {
    return statut === 'Actif' ? 'check_circle' : 'inventory_2';
  }
}
