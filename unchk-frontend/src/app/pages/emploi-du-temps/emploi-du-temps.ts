import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { EmploiDuTempsService, CoursItem } from '../../services/emploi-du-temps.service';

@Component({
  selector: 'app-emploi-du-temps',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './emploi-du-temps.html',
  styleUrls: ['./emploi-du-temps.css'],
})
export class EmploiDuTemps implements OnInit {

  prenomUtilisateur = 'Étudiant';
  nomUtilisateur = '';
  jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  emploiDuTemps: CoursItem[] = [];
  loading = false;
  erreur = '';
  semaineOffset = 0;
  isBrowser = false;

  // Données demo conformes à l'interface CoursItem
  private emploiDemo: CoursItem[] = [
    { id: 1,  jour: 'Lundi',    heure: '08:00 - 10:00', cours: 'Algorithmique',     salle: 'Amphi A',   color: 'blue',   formation: 'Informatique', niveau: 'L2', semaine: '' },
    { id: 2,  jour: 'Lundi',    heure: '10:00 - 12:00', cours: 'Base de données',   salle: 'Salle 101', color: 'green',  formation: 'Informatique', niveau: 'L2', semaine: '' },
    { id: 3,  jour: 'Mardi',    heure: '08:00 - 10:00', cours: 'Réseaux',           salle: 'Amphi B',   color: 'orange', formation: 'Informatique', niveau: 'L2', semaine: '' },
    { id: 4,  jour: 'Mardi',    heure: '14:00 - 16:00', cours: 'Développement Web', salle: 'Salle 203', color: 'purple', formation: 'Informatique', niveau: 'L2', semaine: '' },
    { id: 5,  jour: 'Mercredi', heure: '10:00 - 12:00', cours: 'Mathématiques',     salle: 'Amphi C',   color: 'red',    formation: 'Informatique', niveau: 'L2', semaine: '' },
    { id: 6,  jour: 'Mercredi', heure: '14:00 - 16:00', cours: 'Algorithmique TP',  salle: 'Labo 1',    color: 'blue',   formation: 'Informatique', niveau: 'L2', semaine: '' },
    { id: 7,  jour: 'Jeudi',    heure: '08:00 - 10:00', cours: 'Systèmes',          salle: 'Salle 105', color: 'green',  formation: 'Informatique', niveau: 'L2', semaine: '' },
    { id: 8,  jour: 'Jeudi',    heure: '10:00 - 12:00', cours: 'Réseaux TP',        salle: 'Labo 2',    color: 'orange', formation: 'Informatique', niveau: 'L2', semaine: '' },
    { id: 9,  jour: 'Vendredi', heure: '08:00 - 10:00', cours: 'Probabilités',      salle: 'Amphi A',   color: 'purple', formation: 'Informatique', niveau: 'L2', semaine: '' },
    { id: 10, jour: 'Vendredi', heure: '14:00 - 16:00', cours: 'Projet tutoré',     salle: 'Salle 301', color: 'red',    formation: 'Informatique', niveau: 'L2', semaine: '' },
  ];

  constructor(
    private authService: AuthService,
    private emploiService: EmploiDuTempsService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) return;

    const user = this.authService.getUser();
    if (user) {
      this.prenomUtilisateur = user.prenom || 'Étudiant';
      this.nomUtilisateur    = user.nom    || '';
    }

    this.chargerSemaine();
  }

  // ─── Calcul semaine ISO ────────────────────────────────────────────────────
  getSemaineISO(offset: number = 0): string {
    const now = new Date();
    const lundi = new Date(now);
    lundi.setDate(now.getDate() - ((now.getDay() + 6) % 7) + offset * 7);
    lundi.setHours(0, 0, 0, 0);
    const janv4 = new Date(lundi.getFullYear(), 0, 4);
    const startOfWeek1 = new Date(janv4);
    startOfWeek1.setDate(janv4.getDate() - ((janv4.getDay() + 6) % 7));
    const weekNum = Math.floor((lundi.getTime() - startOfWeek1.getTime()) / (7 * 86400000)) + 1;
    return `${lundi.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
  }

  get labelSemaine(): string {
    const now = new Date();
    const lundi = new Date(now);
    lundi.setDate(now.getDate() - ((now.getDay() + 6) % 7) + this.semaineOffset * 7);
    lundi.setHours(0, 0, 0, 0);
    const vendredi = new Date(lundi);
    vendredi.setDate(lundi.getDate() + 4);
    const fmt = (d: Date) =>
      `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    return `${fmt(lundi)} – ${fmt(vendredi)}/${vendredi.getFullYear()}`;
  }

  // ─── Chargement ───────────────────────────────────────────────────────────
  chargerSemaine() {
    if (!this.isBrowser) return;
    this.erreur = '';

    // Affiche immédiatement les données demo avec la bonne semaine
    const semaine = this.getSemaineISO(this.semaineOffset);
    this.emploiDuTemps = this.emploiDemo.map(c => ({ ...c, semaine }));
    this.loading = false;
    this.cdr.detectChanges();

    // Tente l'API en arrière-plan
    this.emploiService.getBySemaine(semaine).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.emploiDuTemps = data;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ─── Navigation ───────────────────────────────────────────────────────────
  semainePrecedente() { this.semaineOffset--; this.chargerSemaine(); }
  semaineSuivante()   { this.semaineOffset++; this.chargerSemaine(); }
  semaineActuelle()   { this.semaineOffset = 0; this.chargerSemaine(); }

  // ─── Filtre par jour ──────────────────────────────────────────────────────
  getCoursParJour(jour: string): CoursItem[] {
    return this.emploiDuTemps
      .filter(e => e.jour === jour)
      .sort((a, b) => a.heure.localeCompare(b.heure));
  }
}
