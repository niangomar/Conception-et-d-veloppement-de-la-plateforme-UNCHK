import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

export interface Examen {
  jour: string;
  mois: string;
  matiere: string;
  heure: string;        // format "HH:MM"
  salle: string;
  color: string;
  statut: 'a-venir' | 'en-cours' | 'passe' | 'termine';
  jours: number;
  dureeMinutes: number; // durée totale de l'épreuve en minutes
}

@Component({
  selector: 'app-examens-etudiant',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './examens-etudiant.html',
  styleUrl: './examens-etudiant.css',
})
export class ExamensEtudiant implements OnInit, OnDestroy {
  prenomUtilisateur = 'Sonia';
  nomUtilisateur = 'Mbaye';

  examens: Examen[] = [
    {
      jour: '02', mois: 'Juin', matiere: 'Algorithmique',
      heure: '09:00', salle: 'Amphi A',
      color: 'blue', statut: 'a-venir', jours: 13, dureeMinutes: 120,
    },
    {
      jour: '05', mois: 'Juin', matiere: 'Base de données',
      heure: '14:00', salle: 'Salle 101',
      color: 'green', statut: 'a-venir', jours: 16, dureeMinutes: 90,
    },
    {
      jour: '10', mois: 'Juin', matiere: 'Réseaux',
      heure: '09:00', salle: 'Amphi B',
      color: 'orange', statut: 'a-venir', jours: 21, dureeMinutes: 120,
    },
    {
      jour: '12', mois: 'Juin', matiere: 'Développement Web',
      heure: '14:00', salle: 'Salle 203',
      color: 'purple', statut: 'a-venir', jours: 23, dureeMinutes: 180,
    },
  ];

  // ─── État du test en cours ────────────────────────────────────────────────
  testActif: Examen | null = null;
  secondesRestantes = 0;
  private timerInterval: any = null;

  // ─── Modal confirmation terminer ──────────────────────────────────────────
  modalConfirmOuvert = false;

  // ─── Toast ────────────────────────────────────────────────────────────────
  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'warning' = 'success';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.prenomUtilisateur = user.prenom || 'Sonia';
      this.nomUtilisateur = user.nom || 'Mbaye';
    }

    this.verifierStatuts();
    setInterval(() => this.verifierStatuts(), 30_000);
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  // ─── Getters stats ────────────────────────────────────────────────────────
  get nbTotal()   { return this.examens.length; }
  get nbPasses()  { return this.examens.filter(e => e.statut === 'passe' || e.statut === 'termine').length; }
  get nbAVenir()  { return this.examens.filter(e => e.statut === 'a-venir').length; }
  get joursAvantPremier(): number {
    const avenir = this.examens.filter(e => e.statut === 'a-venir');
    return avenir.length ? Math.min(...avenir.map(e => e.jours)) : 0;
  }

  // ─── Vérifie si l'heure d'un examen est passée pour changer son statut ───
  verifierStatuts() {
    const maintenant = new Date();
    this.examens.forEach(e => {
      if (e.statut === 'passe' || e.statut === 'termine') return;

      const moisMap: Record<string, number> = {
        'Jan': 0, 'Fév': 1, 'Mar': 2, 'Avr': 3, 'Mai': 4, 'Juin': 5,
        'Juil': 6, 'Août': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Déc': 11,
      };
      const [h, m] = e.heure.split(':').map(Number);
      const annee = maintenant.getFullYear();
      const debut = new Date(annee, moisMap[e.mois] ?? 5, parseInt(e.jour), h, m);
      const fin   = new Date(debut.getTime() + e.dureeMinutes * 60_000);

      if (maintenant >= debut && maintenant < fin) {
        e.statut = 'en-cours';
      } else if (maintenant >= fin) {
        e.statut = 'passe';
      }
    });
  }

  // ─── Démarrer le test ─────────────────────────────────────────────────────
  demarrerTest(examen: Examen) {
    if (this.testActif) return;

    this.testActif = examen;
    this.secondesRestantes = examen.dureeMinutes * 60;
    this.startTimer();
  }

  private startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.secondesRestantes--;
      if (this.secondesRestantes <= 0) {
        this.terminerTestAuto();
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  // ─── Fermeture automatique (temps écoulé) ─────────────────────────────────
  terminerTestAuto() {
    this.stopTimer();
    if (this.testActif) {
      this.testActif.statut = 'termine';
      this.afficherToast(`Temps écoulé — l'épreuve "${this.testActif.matiere}" a été soumise automatiquement.`, 'warning');
      this.testActif = null;
    }
  }

  // ─── Terminer manuellement ────────────────────────────────────────────────
  demanderTerminer() {
    this.modalConfirmOuvert = true;
  }

  annulerTerminer() {
    this.modalConfirmOuvert = false;
  }

  confirmerTerminer() {
    this.modalConfirmOuvert = false;
    this.stopTimer();
    if (this.testActif) {
      this.testActif.statut = 'termine';
      this.afficherToast(`Épreuve "${this.testActif.matiere}" soumise avec succès !`, 'success');
      this.testActif = null;
    }
  }

  // ─── Formatage du timer ───────────────────────────────────────────────────
  get heures(): string {
    return String(Math.floor(this.secondesRestantes / 3600)).padStart(2, '0');
  }
  get minutes(): string {
    return String(Math.floor((this.secondesRestantes % 3600) / 60)).padStart(2, '0');
  }
  get secondes(): string {
    return String(this.secondesRestantes % 60).padStart(2, '0');
  }

  get pourcentageRestant(): number {
    if (!this.testActif) return 100;
    const total = this.testActif.dureeMinutes * 60;
    return Math.round((this.secondesRestantes / total) * 100);
  }

  get couleurTimer(): string {
    if (this.pourcentageRestant > 50) return 'green';
    if (this.pourcentageRestant > 20) return 'orange';
    return 'red';
  }

  // ─── Toast ────────────────────────────────────────────────────────────────
  afficherToast(msg: string, type: 'success' | 'warning') {
    this.toastMessage = msg;
    this.toastType = type;
    this.toastVisible = true;
    setTimeout(() => (this.toastVisible = false), 4000);
  }
}
