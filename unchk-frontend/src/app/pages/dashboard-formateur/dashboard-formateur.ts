import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-formateur',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatCardModule, MatIconModule,
    MatButtonModule, MatTooltipModule,
    HttpClientModule,
  ],
  templateUrl: './dashboard-formateur.html',
  styleUrl: './dashboard-formateur.css',
})
export class DashboardFormateurComponent implements OnInit {

  nomUtilisateur    = '';
  prenomUtilisateur = '';
  emailUtilisateur  = '';
  roleUtilisateur   = '';

  apiUrl = 'http://localhost:8080/api';
  isLoadingDocuments = true;
  isLoadingAnnonces  = true;
  documents: any[] = [];
  annonces:  any[] = [];

  emploiDuTemps = [
    { jour: 'Lun. 16 Juin', heure: '08:00 - 10:00', cours: 'Algorithmique',        formation: 'Licence 2 Info', salle: 'Salle 101',  color: 'blue'   },
    { jour: 'Lun. 16 Juin', heure: '14:00 - 16:00', cours: 'Base de données',      formation: 'Master 1 Info',  salle: 'Salle 203',  color: 'green'  },
    { jour: 'Mar. 17 Juin', heure: '08:00 - 10:00', cours: 'Algorithmique',        formation: 'Licence 3 Info', salle: 'Salle 105',  color: 'blue'   },
    { jour: 'Mer. 18 Juin', heure: '10:00 - 12:00', cours: 'Structures de données',formation: 'Licence 3 Info', salle: 'Amphi B',    color: 'purple' },
    { jour: 'Jeu. 19 Juin', heure: '10:00 - 12:00', cours: 'Base de données',      formation: 'Licence 2 Info', salle: 'Salle 201',  color: 'green'  },
    { jour: 'Ven. 20 Juin', heure: '08:00 - 10:00', cours: 'Structures de données',formation: 'Licence 2 Info', salle: 'Salle 102',  color: 'purple' },
  ];

  cours = [
    { nom: 'Algorithmique',         formation: 'Licence 2 Info', nbEtudiants: 35, niveau: 'L2', color: 'blue',   icon: 'code',         description: 'Complexité, tri, structures de données fondamentales.', moyenneClasse: 13.8 },
    { nom: 'Base de données',       formation: 'Master 1 Info',  nbEtudiants: 28, niveau: 'M1', color: 'green',  icon: 'storage',      description: 'SQL avancé, modélisation, transactions et procédures.',  moyenneClasse: 14.5 },
    { nom: 'Structures de données', formation: 'Licence 3 Info', nbEtudiants: 24, niveau: 'L3', color: 'purple', icon: 'account_tree', description: 'Arbres, graphes, algorithmes de recherche et de tri.',    moyenneClasse: 12.9 },
  ];

  devoirs = [
    { nom: 'TP Algorithmique — Chapitre 3',   formation: 'Licence 2', nbRendus: 28, total: 35, dateLimite: '18/06/2026', jours: 2, urgence: 'urgent', color: 'blue',   icon: 'assignment'   },
    { nom: 'Devoir Base de données — SQL',    formation: 'Master 1',  nbRendus: 20, total: 28, dateLimite: '21/06/2026', jours: 5, urgence: 'moyen',  color: 'green',  icon: 'edit'         },
    { nom: 'Projet Structures de données',    formation: 'Licence 3', nbRendus: 15, total: 24, dateLimite: '24/06/2026', jours: 8, urgence: 'normal', color: 'purple', icon: 'folder_special'},
    { nom: 'TD Algorithmique — Récursivité',  formation: 'Licence 2', nbRendus: 30, total: 35, dateLimite: '17/06/2026', jours: 1, urgence: 'urgent', color: 'blue',   icon: 'description'  },
  ];

  examens = [
    { jour: '20', mois: 'JUIN', matiere: 'Algorithmique',        formation: 'Licence 2', salle: 'Amphi A',   heure: '09h00', duree: '2h', color: 'blue'   },
    { jour: '25', mois: 'JUIN', matiere: 'Base de données',      formation: 'Master 1',  salle: 'Salle 101', heure: '14h00', duree: '2h', color: 'green'  },
    { jour: '28', mois: 'JUIN', matiere: 'Structures de données',formation: 'Licence 3', salle: 'Amphi B',   heure: '09h00', duree: '2h', color: 'purple' },
  ];

  topEtudiants = [
    { nom: 'Awa Mbaye',      formation: 'Licence 3', moyenne: 17.5, pct: 100, color: 'blue'   },
    { nom: 'Fatou Sow',      formation: 'Master 1',  moyenne: 16.2, pct: 93,  color: 'green'  },
    { nom: 'Cheikh Fall',    formation: 'Licence 2', moyenne: 15.8, pct: 90,  color: 'orange' },
    { nom: 'Moussa Ndiaye',  formation: 'Licence 3', moyenne: 14.9, pct: 85,  color: 'purple' },
    { nom: 'Mariama Diallo', formation: 'Licence 2', moyenne: 14.2, pct: 81,  color: 'red'    },
  ];

  activites = [
    { titre: 'TP soumis par Cheikh Fall — Algorithmique',          temps: 'Il y a 10 min',  color: 'green'  },
    { titre: 'Note saisie : Fatou Sow — Base de données 14/20',    temps: 'Il y a 1 heure', color: 'blue'   },
    { titre: 'Nouveau message de Omar Diallo',                      temps: 'Il y a 2h',      color: 'orange' },
    { titre: 'Examen Algorithmique planifié — 20 Juin Amphi A',    temps: 'Hier',            color: 'purple' },
  ];

  get nbEtudiantsTotal(): number { return this.cours.reduce((s, c) => s + c.nbEtudiants, 0); }
  getNbCours():   number { return this.cours.length; }
  getNbDevoirs(): number { return this.devoirs.length; }
  getNbSeances(): number { return this.emploiDuTemps.length; }
  get moyenneGenerale(): string {
    const m = this.cours.reduce((s, c) => s + c.moyenneClasse, 0) / this.cours.length;
    return m.toFixed(1);
  }
  getRenduPct(d: any): number { return Math.round((d.nbRendus / d.total) * 100); }

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.nomUtilisateur    = user.nom    || 'Diallo';
      this.prenomUtilisateur = user.prenom || 'Mamadou';
      this.emailUtilisateur  = user.email  || 'formateur@unchk.sn';
      this.roleUtilisateur   = user.role   || 'Formateur';
    }
    this.loadDocuments();
    this.loadAnnonces();
  }

  loadDocuments() {
    this.http.get<any[]>(`${this.apiUrl}/documents`).subscribe({
      next: (data) => { this.documents = (data || []).slice(0, 4); this.isLoadingDocuments = false; },
      error: () => {
        this.documents = [
          { titre: 'Cours Algorithmique — Chapitre 1',  type: 'Cours',  date_doc: '2026-01-15', fichier_url: '/documents-unchk/algo_chap1.pdf' },
          { titre: 'TP Base de données — SQL avancé',   type: 'TP',     date_doc: '2026-02-10', fichier_url: '/documents-unchk/tp_sql_avance.pdf' },
          { titre: 'Sujet Examen Algorithmique 2025',   type: 'Examen', date_doc: '2025-06-10', fichier_url: '/documents-unchk/exam_algo_juin2025.pdf' },
          { titre: 'TD Mathématiques Discrètes',        type: 'TD',     date_doc: '2026-03-05', fichier_url: '/documents-unchk/td_maths_graphes.pdf' },
        ];
        this.isLoadingDocuments = false;
      },
    });
  }

  loadAnnonces() {
    this.http.get<any[]>(`${this.apiUrl}/annonces`).subscribe({
      next: (data) => { this.annonces = (data || []).slice(0, 3); this.isLoadingAnnonces = false; },
      error: () => {
        this.annonces = [
          { titre: 'Réunion pédagogique',  description: 'Réunion de préparation des examens — Vendredi 20 Juin à 10h.', createdAt: '2026-06-14', type: 'reunion', icon: 'groups'      },
          { titre: 'Dépôt des notes',      description: 'Les notes des devoirs doivent être déposées avant le 25 Juin.',  createdAt: '2026-06-13', type: 'exam',    icon: 'grade'       },
          { titre: 'Nouveau calendrier',   description: 'Le programme des examens du semestre 2 est disponible.',          createdAt: '2026-06-12', type: 'doc',     icon: 'description' },
        ];
        this.isLoadingAnnonces = false;
      },
    });
  }

  ouvrirDocument(d: any) {
    const url = d.fichier_url || d.fichierUrl;
    if (url) window.open(url, '_blank');
  }

  getDocumentIcon(type: string): string {
    const m: Record<string,string> = { 'Cours':'menu_book','TP':'science','TD':'edit_note','Examen':'quiz','Note de service':'description','Circulaire':'article' };
    return m[type] || 'description';
  }

  getDocumentColor(type: string): string {
    const m: Record<string,string> = { 'Cours':'blue','TP':'orange','TD':'green','Examen':'red' };
    return m[type] || 'grey';
  }
}
