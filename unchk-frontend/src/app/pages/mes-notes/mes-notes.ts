import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mes-notes',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './mes-notes.html',
  styleUrl: './mes-notes.css'
})
export class MesNotes implements OnInit {

  nomUtilisateur    = '';
  prenomUtilisateur = '';
  etudiantId: any   = null;

  apiUrl = 'http://localhost:8080/api';

  isLoading = true;
  notes: any[] = [];
  filteredNotes: any[] = [];

  currentFilter = '';
  semestres = ['Semestre 1', 'Semestre 2'];
  currentSemestre = 'Semestre 1';

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
    this.loadNotes();
  }

  loadNotes() {
    this.isLoading = true;
    this.http.get<any[]>(`${this.apiUrl}/notes/etudiant/${this.etudiantId}`).subscribe({
      next: (data) => {
        this.notes = data;
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notes = [
          { matiere: 'Mathématiques',   type: 'Examen', note: 14, noteMax: 20, semestre: 'Semestre 1', enseignant: 'Dr. Sow',    date: '2026-01-15' },
          { matiere: 'Algorithmique',   type: 'Devoir',  note: 16, noteMax: 20, semestre: 'Semestre 1', enseignant: 'M. Diallo',  date: '2026-01-20' },
          { matiere: 'Base de données', type: 'TP',      note: 17, noteMax: 20, semestre: 'Semestre 1', enseignant: 'Mme Ndiaye', date: '2026-02-02' },
          { matiere: 'Réseaux',         type: 'Examen', note: 11, noteMax: 20, semestre: 'Semestre 1', enseignant: 'M. Fall',    date: '2026-02-10' },
          { matiere: 'Anglais',         type: 'Devoir',  note: 13, noteMax: 20, semestre: 'Semestre 1', enseignant: 'Mme Camara', date: '2026-02-18' },
          { matiere: 'Développement Web', type: 'TP',    note: 18, noteMax: 20, semestre: 'Semestre 2', enseignant: 'M. Diallo', date: '2026-04-05' },
          { matiere: 'Systèmes d\'exploitation', type: 'Examen', note: 9, noteMax: 20, semestre: 'Semestre 2', enseignant: 'Dr. Sow', date: '2026-04-12' },
        ];
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ── FILTRES ────────────────────────────────────────
  filterSemestre(semestre: string) {
    this.currentSemestre = semestre;
    this.applyFilters();
  }

  filterType(type: string) {
    this.currentFilter = type;
    this.applyFilters();
  }

  applyFilters() {
    let result = this.notes.filter(n => n.semestre === this.currentSemestre);
    if (this.currentFilter) {
      result = result.filter(n => n.type === this.currentFilter);
    }
    this.filteredNotes = result;
  }

  // ── STATS ──────────────────────────────────────────
  getMoyenne(): number {
    const liste = this.notes.filter(n => n.semestre === this.currentSemestre);
    if (liste.length === 0) return 0;
    const total = liste.reduce((sum, n) => sum + (n.note / n.noteMax) * 20, 0);
    return total / liste.length;
  }

  getMeilleureNote(): number {
    const liste = this.notes.filter(n => n.semestre === this.currentSemestre);
    if (liste.length === 0) return 0;
    return Math.max(...liste.map(n => (n.note / n.noteMax) * 20));
  }

  getNbMatieres(): number {
    const liste = this.notes.filter(n => n.semestre === this.currentSemestre);
    return new Set(liste.map(n => n.matiere)).size;
  }

  getNbEvaluations(): number {
    return this.notes.filter(n => n.semestre === this.currentSemestre).length;
  }

  // ── HELPERS ────────────────────────────────────────
  getNoteClass(note: number, max: number): string {
    const pct = (note / max) * 20;
    if (pct >= 16) return 'note-excellent';
    if (pct >= 12) return 'note-bien';
    if (pct >= 10) return 'note-passable';
    return 'note-insuffisant';
  }

  getTypeIcon(type: string): string {
    if (type === 'Examen') return 'quiz';
    if (type === 'Devoir')  return 'edit_note';
    if (type === 'TP')      return 'science';
    return 'assignment';
  }

  getTypeColor(type: string): string {
    if (type === 'Examen') return 'rouge';
    if (type === 'Devoir')  return 'bleu';
    if (type === 'TP')      return 'vert';
    return 'gris';
  }

  getMentionLabel(moyenne: number): string {
    if (moyenne >= 16) return 'Très bien';
    if (moyenne >= 14) return 'Bien';
    if (moyenne >= 12) return 'Assez bien';
    if (moyenne >= 10) return 'Passable';
    return 'Insuffisant';
  }
}
