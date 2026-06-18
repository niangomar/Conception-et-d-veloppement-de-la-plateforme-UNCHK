import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mes-etudiants',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './mes-etudiants.html',
  styleUrl: './mes-etudiants.css',
})
export class MesEtudiantsComponent implements OnInit {

  prenomUtilisateur = '';
  nomUtilisateur    = '';

  recherche = '';
  filtreFormation = 'tous';

  etudiants = [
    { id: 1, nom: 'Diallo', prenom: 'Aminata',  formation: 'Licence 2 Informatique', niveau: 'L2', moyenne: 14.5, presence: 92, statut: 'actif',    avatar: 'AD', color: 'blue'   },
    { id: 2, nom: 'Ndiaye', prenom: 'Moussa',   formation: 'Licence 2 Informatique', niveau: 'L2', moyenne: 11.2, presence: 78, statut: 'actif',    avatar: 'MN', color: 'blue'   },
    { id: 3, nom: 'Sow',    prenom: 'Fatou',    formation: 'Licence 3 Informatique', niveau: 'L3', moyenne: 16.1, presence: 97, statut: 'actif',    avatar: 'FS', color: 'green'  },
    { id: 4, nom: 'Fall',   prenom: 'Ibrahima', formation: 'Master 1 Informatique',  niveau: 'M1', moyenne: 13.8, presence: 85, statut: 'actif',    avatar: 'IF', color: 'purple' },
    { id: 5, nom: 'Diop',   prenom: 'Marième',  formation: 'Licence 3 Informatique', niveau: 'L3', moyenne:  9.4, presence: 61, statut: 'alerte',   avatar: 'MD', color: 'green'  },
    { id: 6, nom: 'Mbaye',  prenom: 'Ousmane',  formation: 'Master 1 Informatique',  niveau: 'M1', moyenne: 15.3, presence: 94, statut: 'actif',    avatar: 'OM', color: 'purple' },
    { id: 7, nom: 'Gueye',  prenom: 'Aissatou', formation: 'Licence 2 Informatique', niveau: 'L2', moyenne: 12.7, presence: 83, statut: 'actif',    avatar: 'AG', color: 'blue'   },
    { id: 8, nom: 'Sarr',   prenom: 'Cheikh',   formation: 'Licence 3 Informatique', niveau: 'L3', moyenne:  8.1, presence: 55, statut: 'critique', avatar: 'CS', color: 'green'  },
  ];

  get formations(): string[] {
    return [...new Set(this.etudiants.map(e => e.formation))];
  }

  get etudiantsFiltres() {
    return this.etudiants.filter(e => {
      const matchRecherche = this.recherche === '' ||
        e.nom.toLowerCase().includes(this.recherche.toLowerCase()) ||
        e.prenom.toLowerCase().includes(this.recherche.toLowerCase());
      const matchFormation = this.filtreFormation === 'tous' ||
        e.formation === this.filtreFormation;
      return matchRecherche && matchFormation;
    });
  }

  get nbActifs()    { return this.etudiants.filter(e => e.statut === 'actif').length; }
  get nbAlertes()   { return this.etudiants.filter(e => e.statut === 'alerte' || e.statut === 'critique').length; }
  get moyenneGene() {
    const s = this.etudiants.reduce((acc, e) => acc + e.moyenne, 0);
    return (s / this.etudiants.length).toFixed(1);
  }

  onRecherche(e: Event) {
    this.recherche = (e.target as HTMLInputElement).value;
  }

  filtrerFormation(f: string) { this.filtreFormation = f; }

  getStatutLabel(s: string) {
    if (s === 'actif')    return 'Actif';
    if (s === 'alerte')   return 'En alerte';
    if (s === 'critique') return 'Critique';
    return s;
  }

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.prenomUtilisateur = user.prenom || 'Mamadou';
      this.nomUtilisateur    = user.nom    || 'Diallo';
    }
  }
envoyerMessage(e: any) {
  // Pour l'instant on affiche juste une alerte simple
  alert(`Message à ${e.prenom} ${e.nom} — fonctionnalité à connecter au backend`);
}
}
