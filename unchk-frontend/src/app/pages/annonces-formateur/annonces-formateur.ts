import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-annonces-formateur',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './annonces-formateur.html',
  styleUrl: './annonces-formateur.css',
})
export class AnnoncesFormateurComponent implements OnInit {

  prenomUtilisateur = '';
  nomUtilisateur    = '';

  filtreActif = 'tous';
  showForm    = false;

  annonces = [
    {
      id: 1, titre: 'Report du TP Algorithmique',
      description: 'Le TP prévu le 17 Juin est reporté au 19 Juin en Salle 105. Merci de noter ce changement.',
      cours: 'Algorithmique', formation: 'Licence 2 Info',
      type: 'urgent', icon: 'warning', color: 'orange',
      date: '14 Juin 2026', vues: 32
    },
    {
      id: 2, titre: 'Publication des résultats DM SQL',
      description: 'Les résultats du Devoir Maison SQL Avancé sont disponibles sur la plateforme.',
      cours: 'Base de données', formation: 'Master 1 Info',
      type: 'info', icon: 'info', color: 'blue',
      date: '13 Juin 2026', vues: 28
    },
    {
      id: 3, titre: 'Examen partiel — Structures de données',
      description: 'Rappel : l\'examen partiel aura lieu le 25 Juin à 10h00 en Amphi B. Documents non autorisés.',
      cours: 'Structures de données', formation: 'Licence 3 Info',
      type: 'examen', icon: 'school', color: 'purple',
      date: '12 Juin 2026', vues: 24
    },
    {
      id: 4, titre: 'Ressources complémentaires — Arbres AVL',
      description: 'De nouvelles ressources sur les arbres AVL ont été déposées dans la section documents.',
      cours: 'Structures de données', formation: 'Licence 3 Info',
      type: 'info', icon: 'menu_book', color: 'green',
      date: '10 Juin 2026', vues: 19
    },
    {
      id: 5, titre: 'Séance de rattrapage — Base de données',
      description: 'Une séance de rattrapage est organisée le 21 Juin à 14h00 en Salle 201.',
      cours: 'Base de données', formation: 'Master 1 Info',
      type: 'urgent', icon: 'event', color: 'orange',
      date: '09 Juin 2026', vues: 26
    },
  ];

  get annoncesFiltrees() {
    if (this.filtreActif === 'tous') return this.annonces;
    return this.annonces.filter(a => a.type === this.filtreActif);
  }

  get nbUrgentes() { return this.annonces.filter(a => a.type === 'urgent').length; }
  get nbInfos()    { return this.annonces.filter(a => a.type === 'info').length; }
  get nbExamens()  { return this.annonces.filter(a => a.type === 'examen').length; }

  filtrer(f: string) { this.filtreActif = f; }
  toggleForm()       { this.showForm = !this.showForm; }

  getTypeLabel(t: string) {
    const labels: any = { 'urgent': 'Urgent', 'info': 'Information', 'examen': 'Examen' };
    return labels[t] || t;
  }

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.prenomUtilisateur = user.prenom || 'Mamadou';
      this.nomUtilisateur    = user.nom    || 'Diallo';
    }
  }
}
