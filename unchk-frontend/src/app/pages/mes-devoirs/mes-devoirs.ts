import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mes-devoirs',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, FormsModule],
  templateUrl: './mes-devoirs.html',
  styleUrl: './mes-devoirs.css',
})
export class MesDevoirs implements OnInit {
  prenomUtilisateur = 'Sonia';
  nomUtilisateur = 'Mbaye';

  devoirs = [
    {
      nom: 'TP Algorithmique',
      matiere: 'Algorithmique',
      deadline: '22/05/2026',
      jours: 2,
      urgence: 'urgent',
      color: 'blue',
      icon: 'assignment',
      statut: 'en-cours',
    },
    {
      nom: 'Devoir Base de données',
      matiere: 'Base de données',
      deadline: '25/05/2026',
      jours: 5,
      urgence: 'moyen',
      color: 'green',
      icon: 'edit',
      statut: 'en-cours',
    },
    {
      nom: 'Rapport Réseaux',
      matiere: 'Réseaux',
      deadline: '28/05/2026',
      jours: 8,
      urgence: 'normal',
      color: 'orange',
      icon: 'description',
      statut: 'en-cours',
    },
    {
      nom: 'Projet Développement Web',
      matiere: 'Développement Web',
      deadline: '05/06/2026',
      jours: 16,
      urgence: 'normal',
      color: 'purple',
      icon: 'code',
      statut: 'rendu',
    },
  ];

  // ─── Modal ───────────────────────────────────────────────────────────────
  modalOuvert = false;
  devoirSelectionne: any = null;
  commentaire = '';
  fichierChoisi: File | null = null;
  uploadErreur = false;
  toastVisible = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.prenomUtilisateur = user.prenom || 'Sonia';
      this.nomUtilisateur = user.nom || 'Mbaye';
    }
  }

  // ─── Stats dynamiques ─────────────────────────────────────────────────────
  get nbUrgent(): number {
    return this.devoirs.filter(
      (d) => d.statut === 'en-cours' && d.jours <= 3
    ).length;
  }

  get nbEnCours(): number {
    return this.devoirs.filter((d) => d.statut === 'en-cours').length;
  }

  get nbRendu(): number {
    return this.devoirs.filter((d) => d.statut === 'rendu').length;
  }

  get nbTotal(): number {
    return this.devoirs.length;
  }

  // ─── Modal soumission ─────────────────────────────────────────────────────
  ouvrirModalSoumission(devoir: any) {
    this.devoirSelectionne = devoir;
    this.commentaire = '';
    this.fichierChoisi = null;
    this.uploadErreur = false;
    this.modalOuvert = true;
  }

  fermerModal() {
    this.modalOuvert = false;
    this.devoirSelectionne = null;
  }

  onFichierChoisi(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.fichierChoisi = input.files[0];
      this.uploadErreur = false;
    }
  }

  supprimerFichier() {
    this.fichierChoisi = null;
  }

  confirmerSoumission() {
    if (!this.fichierChoisi) {
      this.uploadErreur = true;
      return;
    }

    // TODO : remplacer par un vrai appel API (FormData + service)
    // const formData = new FormData();
    // formData.append('fichier', this.fichierChoisi);
    // formData.append('commentaire', this.commentaire);
    // formData.append('devoirId', this.devoirSelectionne.id);
    // this.devoirService.soumettre(formData).subscribe(...)

    // Mise à jour locale du statut
    this.devoirSelectionne.statut = 'rendu';

    this.fermerModal();

    this.toastVisible = true;
    setTimeout(() => (this.toastVisible = false), 3000);
  }
}
