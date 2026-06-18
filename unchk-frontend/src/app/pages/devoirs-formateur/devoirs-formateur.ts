import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-devoirs-formateur',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './devoirs-formateur.html',
  styleUrl: './devoirs-formateur.css',
})
export class DevoirsFormateurComponent implements OnInit {

  prenomUtilisateur = '';
  nomUtilisateur    = '';

  filtreActif = 'tous';

  devoirs = [
    {
      id: 1, titre: 'TP Noté — Tri rapide', cours: 'Algorithmique', formation: 'Licence 2 Info',
      type: 'tp', dateRemise: '20 Juin 2026', nbRendus: 28, nbTotal: 35,
      statut: 'en-cours', color: 'blue', icon: 'code',
      description: 'Implémenter le tri rapide en Python et analyser sa complexité.'
    },
    {
      id: 2, titre: 'Devoir Maison — SQL Avancé', cours: 'Base de données', formation: 'Master 1 Info',
      type: 'dm', dateRemise: '18 Juin 2026', nbRendus: 28, nbTotal: 28,
      statut: 'corrige', color: 'green', icon: 'storage',
      description: 'Requêtes complexes avec sous-requêtes, jointures et procédures stockées.'
    },
    {
      id: 3, titre: 'Examen Partiel S2', cours: 'Structures de données', formation: 'Licence 3 Info',
      type: 'exam', dateRemise: '25 Juin 2026', nbRendus: 0, nbTotal: 24,
      statut: 'planifie', color: 'purple', icon: 'account_tree',
      description: 'Arbres AVL, graphes orientés et algorithme de Dijkstra.'
    },
    {
      id: 4, titre: 'TP Noté — Arbres binaires', cours: 'Structures de données', formation: 'Licence 3 Info',
      type: 'tp', dateRemise: '15 Juin 2026', nbRendus: 24, nbTotal: 24,
      statut: 'rendu', color: 'purple', icon: 'account_tree',
      description: 'Implémentation et parcours d\'arbres binaires de recherche.'
    },
    {
      id: 5, titre: 'Quiz — Complexité', cours: 'Algorithmique', formation: 'Licence 2 Info',
      type: 'quiz', dateRemise: '22 Juin 2026', nbRendus: 0, nbTotal: 35,
      statut: 'planifie', color: 'blue', icon: 'code',
      description: 'Questions sur la notation Big-O et l\'analyse de complexité.'
    },
    {
      id: 6, titre: 'DM — Modélisation BDD', cours: 'Base de données', formation: 'Master 1 Info',
      type: 'dm', dateRemise: '10 Juin 2026', nbRendus: 25, nbTotal: 28,
      statut: 'rendu', color: 'green', icon: 'storage',
      description: 'Concevoir le schéma entité-association d\'un système de gestion.'
    },
  ];

  get devoirsFiltres() {
    if (this.filtreActif === 'tous') return this.devoirs;
    return this.devoirs.filter(d => d.statut === this.filtreActif);
  }

  get nbEnCours()  { return this.devoirs.filter(d => d.statut === 'en-cours').length; }
  get nbRendus()   { return this.devoirs.filter(d => d.statut === 'rendu' || d.statut === 'corrige').length; }
  get nbPlanifie() { return this.devoirs.filter(d => d.statut === 'planifie').length; }

  getStatutLabel(s: string) {
    const labels: any = {
      'en-cours': 'En cours', 'rendu': 'Rendu', 'corrige': 'Corrigé', 'planifie': 'Planifié'
    };
    return labels[s] || s;
  }

  getTypeLabel(t: string) {
    const labels: any = { 'tp': 'TP Noté', 'dm': 'Devoir Maison', 'exam': 'Examen', 'quiz': 'Quiz' };
    return labels[t] || t;
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
