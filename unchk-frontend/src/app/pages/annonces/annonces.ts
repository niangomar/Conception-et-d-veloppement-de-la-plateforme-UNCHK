import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-annonces',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './annonces.html',
  styleUrl: './annonces.css',
})
export class Annonces implements OnInit {

  prenomUtilisateur = '';
  nomUtilisateur    = '';

  filtreActif = 'tous';

  nbExamens  = 2;
  nbDocuments = 3;
  nbReunions  = 1;
  nbInfos     = 4;

  annonces = [
    { titre: 'Examen partiel S2', type: 'exam', desc: 'Examen le 25 Juin à 10h00 en Amphi B.', date: '12 Juin 2026', icon: 'school' },
    { titre: 'Nouvelles ressources Arbres AVL', type: 'doc', desc: 'Documents disponibles dans la section cours.', date: '10 Juin 2026', icon: 'menu_book' },
    { titre: 'Réunion étudiants L3', type: 'reunion', desc: 'Réunion le 18 Juin à 14h00 en Salle 101.', date: '09 Juin 2026', icon: 'groups' },
    { titre: 'Report TP Algorithmique', type: 'info', desc: 'Le TP du 17 Juin est reporté au 19 Juin.', date: '14 Juin 2026', icon: 'info' },
    { titre: 'Examen Base de données', type: 'exam', desc: 'Examen final le 28 Juin à 08h00 en Amphi A.', date: '08 Juin 2026', icon: 'school' },
    { titre: 'Correction DM SQL publiée', type: 'doc', desc: 'La correction est disponible sur la plateforme.', date: '13 Juin 2026', icon: 'description' },
  ];

  get annoncesFiltrees() {
    if (this.filtreActif === 'tous') return this.annonces;
    return this.annonces.filter(a => a.type === this.filtreActif);
  }

  filtrer(f: string) { this.filtreActif = f; }

  libelleType(type: string) {
    const labels: any = { exam: 'Examen', doc: 'Document', reunion: 'Réunion', info: 'Information' };
    return labels[type] || type;
  }

  ouvrirCategorie(cat: string) { this.filtrer(cat); }
  ouvrirAnnonce(a: any)        { console.log('Annonce:', a.titre); }

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.prenomUtilisateur = user.prenom || 'Étudiant';
      this.nomUtilisateur    = user.nom    || '';
    }
  }
}
