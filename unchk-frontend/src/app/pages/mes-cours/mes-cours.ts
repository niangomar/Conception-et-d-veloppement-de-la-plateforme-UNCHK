import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mes-cours',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatCardModule],
  templateUrl: './mes-cours.html',
  styleUrl: './mes-cours.css',
})
export class MesCoursComponent implements OnInit {

  prenomUtilisateur = '';
  nomUtilisateur    = '';

  // Filtre actif
  filtreActif = 'tous';

  cours = [
    {
      id: 1,
      nom: 'Algorithmique',
      code: 'ALG-L2',
      formation: 'Licence 2 Informatique',
      niveau: 'L2',
      nbEtudiants: 35,
      credits: 4,
      volumeHoraire: 40,
      semestre: 'Semestre 2',
      moyenneClasse: 13.8,
      tauxReussite: 78,
      color: 'blue',
      icon: 'code',
      description: 'Complexité algorithmique, structures de données fondamentales, algorithmes de tri et de recherche.',
      prochainCours: 'Lun. 16 Juin — 08:00 à 10:00 — Salle 101',
    },
    {
      id: 2,
      nom: 'Base de données',
      code: 'BD-M1',
      formation: 'Master 1 Informatique',
      niveau: 'M1',
      nbEtudiants: 28,
      credits: 3,
      volumeHoraire: 30,
      semestre: 'Semestre 2',
      moyenneClasse: 14.5,
      tauxReussite: 85,
      color: 'green',
      icon: 'storage',
      description: 'SQL avancé, modélisation entité-association, transactions, procédures stockées et optimisation.',
      prochainCours: 'Lun. 16 Juin — 14:00 à 16:00 — Salle 203',
    },
    {
      id: 3,
      nom: 'Structures de données',
      code: 'SD-L3',
      formation: 'Licence 3 Informatique',
      niveau: 'L3',
      nbEtudiants: 24,
      credits: 4,
      volumeHoraire: 35,
      semestre: 'Semestre 2',
      moyenneClasse: 12.9,
      tauxReussite: 70,
      color: 'purple',
      icon: 'account_tree',
      description: 'Arbres binaires, graphes, algorithmes de parcours, algorithmes de chemin le plus court.',
      prochainCours: 'Mer. 18 Juin — 10:00 à 12:00 — Amphi B',
    },
  ];
getTotalEtudiants(): number {
  return this.cours.reduce((sum, c) => sum + c.nbEtudiants, 0);
}

  get coursFiltres() {
    if (this.filtreActif === 'tous') return this.cours;
    return this.cours.filter(c => c.niveau.toLowerCase() === this.filtreActif);
  }

  get niveaux(): string[] {
    return [...new Set(this.cours.map(c => c.niveau))];
  }

  filtrer(f: string) { this.filtreActif = f; }

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.prenomUtilisateur = user.prenom || 'Mamadou';
      this.nomUtilisateur    = user.nom    || 'Diallo';
    }
  }
}
