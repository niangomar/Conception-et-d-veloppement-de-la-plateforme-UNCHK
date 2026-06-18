import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  showNotifications = false;

  notifications = [
    { id: 1, icon: 'person_add', color: 'green', titre: 'Nouvel étudiant ajouté', message: 'Cheikh Fall inscrit en L3 Informatique', temps: 'Il y a 10 min', lu: false },
    { id: 2, icon: 'book', color: 'orange', titre: 'Formation créée', message: 'La formation Angular 17 a été ajoutée', temps: 'Il y a 1 heure', lu: false },
    { id: 3, icon: 'description', color: 'blue', titre: 'Nouveau document', message: 'Calendrier académique 2024.pdf déposé', temps: 'Il y a 3 heures', lu: false },
    { id: 4, icon: 'event', color: 'purple', titre: 'Réunion programmée', message: 'Comité pédagogique — 17 Mai à 14h00', temps: 'Il y a 5 heures', lu: true },
    { id: 5, icon: 'warning', color: 'red', titre: 'Alerte système', message: '3 documents en attente de validation', temps: 'Hier', lu: true },
  ];

  get notifNonLues(): number {
    return this.notifications.filter(n => !n.lu).length;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  marquerToutLu() {
    this.notifications.forEach(n => n.lu = true);
  }

  marquerLu(id: number) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) notif.lu = true;
  }

  supprimerNotif(id: number, event: Event) {
    event.stopPropagation();
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  @HostListener('document:click', ['$event'])
  fermerNotifications(event: Event) {
    if (!isPlatformBrowser(this.platformId)) return;
    const target = event.target as HTMLElement;
    if (!target.closest('.notif-btn') && !target.closest('.notif-dropdown')) {
      this.showNotifications = false;
    }
  }
}
