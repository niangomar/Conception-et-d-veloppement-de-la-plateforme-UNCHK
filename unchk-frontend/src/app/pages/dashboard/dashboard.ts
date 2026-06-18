import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Chart, registerables } from 'chart.js';
import { SidebarComponent } from '../../components/sidebar/sidebar';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatCardModule, MatIconModule, MatButtonModule, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('barChart') barChartRef!: ElementRef;
  @ViewChild('donutChart') donutChartRef!: ElementRef;
  @ViewChild('lineChart') lineChartRef!: ElementRef;

  dateAujourdhui = '';
  heureActuelle = '';
  salutation = '';
  private timer: any;

  // ── NOTIFICATIONS ──────────────────────────────────────────
  showNotifications = false;

  notifications = [
    { id: 1, icon: 'person_add', color: 'green', titre: 'Nouvel étudiant ajouté', message: 'Cheikh Fall a été inscrit en L3 Informatique', temps: 'Il y a 10 min', lu: false },
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
    const target = event.target as HTMLElement;
    if (!target.closest('.notif-btn') && !target.closest('.notif-dropdown')) {
      this.showNotifications = false;
    }
  }
  // ───────────────────────────────────────────────────────────

  evenements = [
    { jour: '17', mois: 'MAI', titre: 'Réunion pédagogique', heure: "Aujourd'hui à 14h00", color: 'blue' },
    { jour: '18', mois: 'MAI', titre: 'Soutenance mémoire', heure: 'Demain à 09h00', color: 'green' },
    { jour: '20', mois: 'MAI', titre: 'Début des inscriptions', heure: 'Lundi prochain', color: 'orange' },
    { jour: '25', mois: 'MAI', titre: 'Atelier Angular', heure: '25 Mai à 10h00', color: 'red' },
  ];

  activites = [
    { titre: 'Nouvel étudiant ajouté', temps: 'Il y a 10 min', color: 'green' },
    { titre: 'Formation "Angular" créée', temps: 'Il y a 1 heure', color: 'orange' },
    { titre: 'Document "Calendrier.pdf" déposé', temps: 'Il y a 3 heures', color: 'blue' },
    { titre: 'Réunion "Comité pédagogique" programmée', temps: 'Il y a 5 heures', color: 'purple' },
  ];

  topFormations = [
    { nom: 'Développement Web', nb: 250, pct: 100, color: 'blue' },
    { nom: 'Génie Logiciel', nb: 180, pct: 72, color: 'green' },
    { nom: 'Data Science', nb: 140, pct: 56, color: 'orange' },
    { nom: 'Réseaux et Sécurité', nb: 120, pct: 48, color: 'red' },
    { nom: 'Intelligence Artificielle', nb: 100, pct: 40, color: 'purple' },
  ];

  // ── INJECTION PLATFORM_ID ──────────────────────────────────
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.updateDateTime();
      this.timer = setInterval(() => this.updateDateTime(), 1000);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.createBarChart();
      this.createDonutChart();
      this.createLineChart();
    }
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  updateDateTime() {
    const now = new Date();
    const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
                  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    this.dateAujourdhui = `${jours[now.getDay()]} ${now.getDate()} ${mois[now.getMonth()]} ${now.getFullYear()}`;
    this.heureActuelle = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const h = now.getHours();
    if (h < 12) this.salutation = 'Bonjour';
    else if (h < 18) this.salutation = 'Bon après-midi';
    else this.salutation = 'Bonsoir';
  }

  createBarChart() {
    new Chart(this.barChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Informatique', 'Gestion', 'Mathématiques', 'Réseaux'],
        datasets: [{
          label: 'Étudiants',
          data: [420, 300, 220, 305],
          backgroundColor: [
            'rgba(33, 150, 243, 0.85)',
            'rgba(76, 175, 80, 0.85)',
            'rgba(255, 152, 0, 0.85)',
            'rgba(156, 39, 176, 0.85)',
          ],
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  createDonutChart() {
    new Chart(this.donutChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Hommes', 'Femmes'],
        datasets: [{
          data: [62, 38],
          backgroundColor: ['#2196F3', '#E91E63'],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 20, font: { size: 13 } }
          }
        }
      }
    });
  }

  createLineChart() {
    new Chart(this.lineChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc', 'Janv', 'Fév', 'Mars', 'Avr', 'Mai'],
        datasets: [{
          label: 'Inscriptions',
          data: [200, 320, 280, 450, 600, 750, 820, 900, 980, 1050, 1150, 1245],
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#2196F3',
          pointRadius: 4,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: false, grid: { color: '#f0f0f0' } },
          x: { grid: { display: false } }
        }
      }
    });
  }
}
