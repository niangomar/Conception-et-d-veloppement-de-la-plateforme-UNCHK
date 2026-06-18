import { Component, OnInit } from '@angular/core';
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
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-annonces-admin',
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatTooltipModule, MatSnackBarModule,
    MatToolbarModule, RouterModule,
    SidebarComponent
  ],
  templateUrl: './annonces-admin.html',
  styleUrl: './annonces-admin.css'
})
export class AnnoncesAdminComponent implements OnInit {

  apiUrl = 'http://localhost:8080/api/annonces';
  annonces: any[] = [];
  filteredAnnonces: any[] = [];
  showForm = false;
  editMode = false;
  searchText = '';
  currentFilter = '';
  types = ['info', 'urgent', 'examen', 'reunion', 'doc'];
  rolesAcces = ['Tous', 'Admin', 'Enseignant', 'Etudiant'];
  statuts = ['Actif', 'Archivé'];
  annonce: any = this.emptyAnnonce();

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit() { this.loadAnnonces(); }

  emptyAnnonce() {
    return { titre: '', description: '', type: 'info', icon: 'campaign', roleAcces: 'Tous', statut: 'Actif' };
  }

  getActives()  { return this.annonces.filter(a => a.statut === 'Actif').length; }
  getArchivees(){ return this.annonces.filter(a => a.statut === 'Archivé').length; }
  getCount(type: string) { return this.annonces.filter(a => a.type === type).length; }

  getTypeIcon(type: string) {
    if (type === 'urgent')  return 'warning';
    if (type === 'examen')  return 'school';
    if (type === 'reunion') return 'groups';
    if (type === 'doc')     return 'description';
    return 'info';
  }

  getTypeColor(type: string) {
    if (type === 'urgent')  return 'orange';
    if (type === 'examen')  return 'violet';
    if (type === 'reunion') return 'vert';
    if (type === 'doc')     return 'gris';
    return 'bleu';
  }

  getTypeLabel(type: string) {
    const labels: any = { info: 'Information', urgent: 'Urgent', examen: 'Examen', reunion: 'Réunion', doc: 'Document' };
    return labels[type] || type;
  }

  filterType(type: string) { this.currentFilter = type; this.applyFilters(); }

  applyFilters() {
    let result = [...this.annonces];
    if (this.currentFilter) result = result.filter(a => a.type === this.currentFilter);
    if (this.searchText) {
      const s = this.searchText.toLowerCase();
      result = result.filter(a => a.titre?.toLowerCase().includes(s) || a.description?.toLowerCase().includes(s));
    }
    this.filteredAnnonces = result;
  }

  filterSearch() { this.applyFilters(); }

  loadAnnonces() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => { this.annonces = data; this.filteredAnnonces = data; },
      error: () => this.snackBar.open('❌ Erreur de chargement !', 'Fermer', { duration: 3000 })
    });
  }

  openForm() { this.editMode = false; this.annonce = this.emptyAnnonce(); this.showForm = true; }

  editAnnonce(a: any) { this.annonce = { ...a }; this.editMode = true; this.showForm = true; }

  onTypeChange() { this.annonce.icon = this.getTypeIcon(this.annonce.type); }

  saveAnnonce() {
    if (!this.annonce.titre || !this.annonce.description) {
      this.snackBar.open('⚠️ Titre et description sont obligatoires !', 'Fermer', { duration: 3000 });
      return;
    }
    this.annonce.icon = this.getTypeIcon(this.annonce.type);
    const req = this.editMode
      ? this.http.put(`${this.apiUrl}/${this.annonce.id}`, this.annonce)
      : this.http.post(this.apiUrl, this.annonce);
    req.subscribe({
      next: () => { this.showForm = false; this.loadAnnonces(); this.snackBar.open(this.editMode ? '✅ Annonce modifiée !' : '✅ Annonce publiée !', 'Fermer', { duration: 3000 }); },
      error: () => this.snackBar.open('❌ Erreur lors de la publication !', 'Fermer', { duration: 3000 })
    });
  }

  deleteAnnonce(id: number) {
    this.snackBar.open('⚠️ Supprimer cette annonce ?', 'Supprimer', { duration: 5000 })
      .onAction().subscribe(() => {
        this.http.delete(`${this.apiUrl}/${id}`).subscribe({
          next: () => { this.loadAnnonces(); this.snackBar.open('🗑️ Annonce supprimée !', 'Fermer', { duration: 3000 }); }
        });
      });
  }

  archiverAnnonce(a: any) {
    this.http.put(`${this.apiUrl}/${a.id}`, { ...a, statut: 'Archivé' }).subscribe({
      next: () => { this.loadAnnonces(); this.snackBar.open('📦 Annonce archivée !', 'Fermer', { duration: 3000 }); }
    });
  }

  getStatutClass(statut: string) {
    return { 'actif': statut === 'Actif', 'archive': statut === 'Archivé' };
  }
}
