import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-emploi-du-temps-formateur',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatCardModule],
  templateUrl: './emploi-du-temps-formateur.html',
  styleUrl: './emploi-du-temps-formateur.css',
})
export class EmploiDuTempsFormateurComponent implements OnInit {

  prenomUtilisateur = '';
  nomUtilisateur    = '';

  semaineActuelle = 'Semaine du 16 au 20 Juin 2026';

  jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

  seances = [
    { jour: 'Lundi',    date: '16 Juin', heure: '08:00 - 10:00', cours: 'Algorithmique',         formation: 'Licence 2 Info', salle: 'Salle 101', color: 'blue',   type: 'CM' },
    { jour: 'Lundi',    date: '16 Juin', heure: '14:00 - 16:00', cours: 'Base de données',       formation: 'Master 1 Info',  salle: 'Salle 203', color: 'green',  type: 'TD' },
    { jour: 'Mardi',    date: '17 Juin', heure: '08:00 - 10:00', cours: 'Algorithmique',         formation: 'Licence 3 Info', salle: 'Salle 105', color: 'blue',   type: 'TP' },
    { jour: 'Mercredi', date: '18 Juin', heure: '10:00 - 12:00', cours: 'Structures de données', formation: 'Licence 3 Info', salle: 'Amphi B',   color: 'purple', type: 'CM' },
    { jour: 'Jeudi',    date: '19 Juin', heure: '10:00 - 12:00', cours: 'Base de données',       formation: 'Licence 2 Info', salle: 'Salle 201', color: 'green',  type: 'TP' },
    { jour: 'Vendredi', date: '20 Juin', heure: '08:00 - 10:00', cours: 'Structures de données', formation: 'Licence 2 Info', salle: 'Salle 102', color: 'purple', type: 'TD' },
  ];

  getSeancesByJour(jour: string) {
    return this.seances.filter(s => s.jour === jour);
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
