import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-etudiant',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    HttpClientModule
  ],
  templateUrl: './dashboard-etudiant.html',
  styleUrl: './dashboard-etudiant.css'
})
export class DashboardEtudiantComponent implements OnInit {

  nomUtilisateur    = '';
  prenomUtilisateur = '';
  etudiantId: any   = null;

  apiUrl = 'http://localhost:8080/api';

  isLoadingDocuments = true;
  isLoadingAnnonces  = true;
  isLoadingNotes      = true;

  documents: any[] = [];
  annonces:  any[] = [];
  notes:     any[] = [];

  emploiDuTemps = [
    { jour: 'Lun. 19 Mai', heure: '08:00 - 10:00', cours: 'Algorithmique',    salle: 'Salle 101' },
    { jour: 'Lun. 19 Mai', heure: '10:00 - 12:00', cours: 'Base de données',  salle: 'Salle 203' },
    { jour: 'Mar. 20 Mai', heure: '08:00 - 10:00', cours: 'Réseaux',          salle: 'Salle 105' },
    { jour: 'Mer. 21 Mai', heure: '10:00 - 12:00', cours: 'Développement Web', salle: 'Salle 201' },
  ];

  devoirs = [
    { nom: 'TP Algorithmique',       deadline: 'À rendre le 22/05/2026', jours: 2, urgence: 'urgent', color: 'blue',   icon: 'assignment' },
    { nom: 'Devoir Base de données', deadline: 'À rendre le 25/05/2026', jours: 5, urgence: 'moyen',  color: 'green',  icon: 'edit' },
    { nom: 'Rapport Réseaux',        deadline: 'À rendre le 28/05/2026', jours: 8, urgence: 'normal', color: 'orange', icon: 'description' },
  ];

  examens = [
    { jour: '02', mois: 'Juin', matiere: 'Algorithmique',     heure: '09:00', salle: 'Amphi A',   color: 'blue' },
    { jour: '05', mois: 'Juin', matiere: 'Base de données',   heure: '14:00', salle: 'Salle 101', color: 'green' },
    { jour: '10', mois: 'Juin', matiere: 'Réseaux',           heure: '09:00', salle: 'Amphi B',   color: 'orange' },
    { jour: '12', mois: 'Juin', matiere: 'Développement Web', heure: '14:00', salle: 'Salle 203', color: 'purple' },
  ];

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.nomUtilisateur    = user.nom    || '';
      this.prenomUtilisateur = user.prenom || '';
      this.etudiantId        = user.id     || null;
    }
    this.loadDocuments();
    this.loadAnnonces();
    this.loadNotes();
  }

  // ── DOCUMENTS ──────────────────────────────────────
  loadDocuments() {
    this.isLoadingDocuments = true;
    this.http.get<any[]>(`${this.apiUrl}/documents/role/etudiant`).subscribe({
      next: (data) => {
        this.documents = data.slice(0, 4);
        this.isLoadingDocuments = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingDocuments = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ── ANNONCES ───────────────────────────────────────
  loadAnnonces() {
    this.isLoadingAnnonces = true;
    this.http.get<any[]>(`${this.apiUrl}/annonces`).subscribe({
      next: (data) => {
        this.annonces = data.slice(0, 3);
        this.isLoadingAnnonces = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.annonces = [
          { titre: 'Examens du semestre',   description: 'Les examens commenceront le 02 Juin 2026.',  date: '2026-06-01', type: 'exam',    icon: 'event' },
          { titre: 'Nouvelle ressource',    description: 'Le support du cours Réseaux est disponible.', date: '2026-05-30', type: 'doc',     icon: 'description' },
          { titre: "Réunion d'information", description: "Réunion d'information le vendredi à 14h.",    date: '2026-05-28', type: 'reunion', icon: 'groups' },
        ];
        this.isLoadingAnnonces = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ── NOTES ──────────────────────────────────────────
  loadNotes() {
    this.isLoadingNotes = true;
    this.http.get<any[]>(`${this.apiUrl}/notes/etudiant/${this.etudiantId}`).subscribe({
      next: (data) => {
        this.notes = data;
        this.isLoadingNotes = false;
        this.cdr.detectChanges();
      },
      error: () => {
        // Fallback statique si l'API n'est pas encore prête
        this.notes = [
          { matiere: 'Mathématiques',   type: 'Examen', note: 14, noteMax: 20 },
          { matiere: 'Algorithmique',   type: 'Devoir', note: 16, noteMax: 20 },
          { matiere: 'Base de données', type: 'TP',     note: 17, noteMax: 20 },
          { matiere: 'Réseaux',         type: 'Examen', note: 11, noteMax: 20 },
          { matiere: 'Anglais',         type: 'Devoir', note: 13, noteMax: 20 },
        ];
        this.isLoadingNotes = false;
        this.cdr.detectChanges();
      }
    });
  }

  getMoyenne(): number {
    if (this.notes.length === 0) return 0;
    const total = this.notes.reduce((sum, n) => sum + (n.note / n.noteMax) * 20, 0);
    return total / this.notes.length;
  }

  getNoteClass(note: number, max: number): string {
    const pct = (note / max) * 20;
    if (pct >= 16) return 'note-excellent';
    if (pct >= 12) return 'note-bien';
    if (pct >= 10) return 'note-passable';
    return 'note-insuffisant';
  }

  // ── HELPERS DOCUMENTS ──────────────────────────────
  getDocumentIcon(type: string): string {
    if (type === 'Cours')  return 'menu_book';
    if (type === 'TP')     return 'science';
    if (type === 'TD')     return 'edit_note';
    if (type === 'Examen') return 'quiz';
    return 'description';
  }

  getDocumentColor(type: string): string {
    if (type === 'Cours')  return 'blue';
    if (type === 'TP')     return 'orange';
    if (type === 'TD')     return 'green';
    if (type === 'Examen') return 'red';
    return 'grey';
  }

  ouvrirDocument(d: any) {
    if (d.fichier_url) {
      window.open(d.fichier_url, '_blank');
    }
  }

  // ── STATS ──────────────────────────────────────────
  getNbDocuments(): number {
    return this.documents.length;
  }

  getNbCours(): number {
    return this.documents.filter(d => d.type === 'Cours').length;
  }

  getNbTP(): number {
    return this.documents.filter(d => d.type === 'TP' || d.type === 'TD').length;
  }

  getNbExamens(): number {
    return this.documents.filter(d => d.type === 'Examen').length;
  }
}
