import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

// ── Réponse brute de l'API Spring Boot (camelCase) ──────────────────────────
interface DocumentAPI {
  id: number;
  type: string;
  titre: string;
  reference: string;
  dateDoc: string;
  contenu: string;
  fichierUrl: string;
  description: string;
  roleAcces: string;
  statut: string;
  createdAt: string;
  auteur?: any;
  matiere?: string;
  taille?: string;
}

// ── Modèle interne du composant (snake_case unifié) ───────────────────────────
interface Document {
  id: number;
  type: string;
  titre: string;
  reference: string;
  date_doc: string;
  contenu: string;
  fichier_url: string;
  description: string;
  role_acces: string;
  statut: string;
  created_at: string;
  auteur_id: number;
  matiere?: string;
  taille?: string;
  fichierLocal?: File;
  blobUrl?: string;
}

interface NouveauDoc {
  titre: string;
  type: string;
  matiere: string;
  reference: string;
  date_doc: string;
  description: string;
  statut: string;
  fichier: File | null;
}

@Component({
  selector: 'app-mes-documents',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, HttpClientModule, FormsModule],
  templateUrl: './mes-documents.html',
  styleUrl: './mes-documents.css',
})
export class MesDocuments implements OnInit {
  prenomUtilisateur = 'Sonia';
  nomUtilisateur = 'Mbaye';

  documents: Document[] = [];
  documentsFiltres: Document[] = [];
  filtreActif = 'tous';
  recherche = '';
  chargement = true;
  erreur = '';

  // ─── Modal ajout ──────────────────────────────────────────────────────────
  modalOuvert = false;
  enEnvoi = false;
  msgSucces = '';
  msgErreurForm = '';
  fichierSelectionne: File | null = null;
  nomFichierAffiche = '';

  nouveauDoc: NouveauDoc = {
    titre: '', type: 'Cours', matiere: '', reference: '',
    date_doc: '', description: '', statut: 'actif', fichier: null,
  };

  readonly typesDoc = ['Cours', 'TP', 'TD', 'Examen', 'Note de service', 'Circulaire', 'Autre'];
  readonly matieres = [
    'Algorithmique', 'Base de données', 'Réseaux', 'Développement Web',
    'Systèmes', 'Mathématiques', 'Probabilités', 'Autre',
  ];

  // ─── URL de base des fichiers ─────────────────────────────────────────────
  // Si XAMPP sert les fichiers sur http://localhost/documents-unchk/
  private xamppUrl = 'http://localhost/documents-unchk';

  // Si les fichiers sont dans src/assets/documents-unchk/ d'Angular :
  // private xamppUrl = 'assets/documents-unchk';

  private documentsDemo: Document[] = [
    {
      id: 1, type: 'Cours',
      titre: 'Cours Algorithmique — Chapitre 1 : Introduction',
      reference: 'ALG-2026-001', date_doc: '2026-01-15',
      contenu: '', fichier_url: 'http://localhost/documents-unchk/algo_chap1.pdf',
      description: 'Introduction aux algorithmes, complexité et structures de données de base.',
      role_acces: 'etudiant', statut: 'actif', created_at: '2026-01-15',
      auteur_id: 1, matiere: 'Algorithmique', taille: '2.4 Mo',
    },
    {
      id: 2, type: 'Cours',
      titre: 'Cours Réseaux — Modèle OSI et TCP/IP',
      reference: 'RES-2026-002', date_doc: '2026-02-01',
      contenu: '', fichier_url: 'http://localhost/documents-unchk/reseaux_osi_tcpip.doc',
      description: 'Présentation détaillée du modèle OSI et de la pile TCP/IP avec exercices.',
      role_acces: 'etudiant', statut: 'actif', created_at: '2026-02-01',
      auteur_id: 2, matiere: 'Réseaux', taille: '3.1 Mo',
    },
    {
      id: 3, type: 'Cours',
      titre: 'Cours Développement Web — Angular 17',
      reference: 'WEB-2026-003', date_doc: '2026-02-20',
      contenu: '', fichier_url: 'http://localhost/documents-unchk/angular17_intro.pdf',
      description: 'Introduction au framework Angular 17 : composants, directives, services et routing.',
      role_acces: 'etudiant', statut: 'actif', created_at: '2026-02-20',
      auteur_id: 3, matiere: 'Développement Web', taille: '5.8 Mo',
    },
    {
      id: 4, type: 'TP',
      titre: 'TP Base de données — Requêtes SQL avancées',
      reference: 'BD-TP-2026-001', date_doc: '2026-02-10',
      contenu: '', fichier_url: 'http://localhost/documents-unchk/tp_sql_avance.pdf',
      description: 'Travaux pratiques : jointures, sous-requêtes, procédures stockées et triggers.',
      role_acces: 'etudiant', statut: 'actif', created_at: '2026-02-10',
      auteur_id: 1, matiere: 'Base de données', taille: '1.2 Mo',
    },
    {
      id: 5, type: 'TP',
      titre: 'TP Réseaux — Configuration de routeurs Cisco',
      reference: 'RES-TP-2026-002', date_doc: '2026-03-18',
      contenu: '', fichier_url: 'http://localhost/documents-unchk/tp_routeurs_cisco.pdf',
      description: 'Simulation de configuration de routeurs Cisco avec Packet Tracer.',
      role_acces: 'etudiant', statut: 'actif', created_at: '2026-03-18',
      auteur_id: 2, matiere: 'Réseaux', taille: '2.7 Mo',
    },
    {
      id: 6, type: 'TD',
      titre: 'TD Mathématiques Discrètes — Graphes et combinatoire',
      reference: 'MATH-TD-2026-001', date_doc: '2026-03-05',
      contenu: '', fichier_url: 'http://localhost/documents-unchk/td_maths_graphes.pdf',
      description: 'Séries de TD sur la théorie des graphes, la combinatoire et les preuves formelles.',
      role_acces: 'etudiant', statut: 'actif', created_at: '2026-03-05',
      auteur_id: 4, matiere: 'Mathématiques', taille: '1.9 Mo',
    },
    {
      id: 7, type: 'Examen',
      titre: 'Sujet Examen Algorithmique — Session Juin 2025',
      reference: 'EXAM-ALG-2025-001', date_doc: '2025-06-10',
      contenu: '', fichier_url: 'http://localhost/documents-unchk/exam_algo_juin2025.pdf',
      description: "Ancien sujet d'examen d'algorithmique avec corrigé indicatif.",
      role_acces: 'etudiant', statut: 'actif', created_at: '2025-06-10',
      auteur_id: 1, matiere: 'Algorithmique', taille: '0.8 Mo',
    },
    {
      id: 8, type: 'Examen',
      titre: 'Sujet Examen Réseaux — Session Juin 2025',
      reference: 'EXAM-RES-2025-002', date_doc: '2025-06-15',
      contenu: '', fichier_url: 'http://localhost/documents-unchk/exam_reseaux_juin2025.pdf',
      description: "Ancien sujet d'examen Réseaux : couche transport, sécurité et routage.",
      role_acces: 'etudiant', statut: 'actif', created_at: '2025-06-15',
      auteur_id: 2, matiere: 'Réseaux', taille: '1.1 Mo',
    },
    {
      id: 9, type: 'Examen',
      titre: 'Sujet Examen Base de données — Session Janvier 2025',
      reference: 'EXAM-BD-2025-003', date_doc: '2025-01-20',
      contenu: '', fichier_url: 'http://localhost/documents-unchk/exam_bd_jan2025.pdf',
      description: 'Sujet de base de données : modélisation, SQL et normalisation.',
      role_acces: 'etudiant', statut: 'actif', created_at: '2025-01-20',
      auteur_id: 1, matiere: 'Base de données', taille: '0.9 Mo',
    },
    {
      id: 10, type: 'Examen',
      titre: 'Sujet Examen Développement Web — Session Juin 2024',
      reference: 'EXAM-WEB-2024-004', date_doc: '2024-06-12',
      contenu: '', fichier_url: 'http://localhost/documents-unchk/exam_web_juin2024.pdf',
      description: 'Ancien sujet couvrant HTML, CSS, JavaScript et PHP.',
      role_acces: 'etudiant', statut: 'actif', created_at: '2024-06-12',
      auteur_id: 3, matiere: 'Développement Web', taille: '1.3 Mo',
    },
    {
      id: 11, type: 'Note de service',
      titre: 'Note de rentrée 2025-2026',
      reference: 'NS-2025-001', date_doc: '2025-09-01',
      contenu: '', fichier_url: '',
      description: 'Note de service pour la rentrée académique 2025-2026.',
      role_acces: 'etudiant', statut: 'actif', created_at: '2025-09-01',
      auteur_id: 5, matiere: '', taille: '',
    },
    {
      id: 12, type: 'Circulaire',
      titre: 'Circulaire bourses étudiantes 2026',
      reference: 'CIRC-2026-002', date_doc: '2026-01-10',
      contenu: '', fichier_url: '',
      description: "Informations sur les bourses disponibles pour l'année 2026.",
      role_acces: 'etudiant', statut: 'actif', created_at: '2026-01-10',
      auteur_id: 5, matiere: '', taille: '',
    },
  ];

  private apiUrl = 'http://localhost:8080/api/documents';
  private prochainId = 200;

  // ─── Toast ────────────────────────────────────────────────────────────────
  toastMessage = '';
  toastVisible = false;
  toastType: 'success' | 'info' | 'warning' = 'info';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.prenomUtilisateur = user.prenom || 'Sonia';
      this.nomUtilisateur = user.nom || 'Mbaye';
    }
    this.chargerDocuments();
  }

  // ─── Chargement ───────────────────────────────────────────────────────────
  chargerDocuments() {
    this.chargement = true;
    this.http.get<DocumentAPI[]>(`${this.apiUrl}/role/etudiant`).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          const seen = new Set<string>();
          this.documents = data
            .map(d => this.apiToDoc(d))
            .filter(d => {
              if (seen.has(d.reference)) return false;
              seen.add(d.reference);
              return true;
            });
        } else {
          this.documents = [...this.documentsDemo];
        }
        this.appliquerFiltres();
        this.chargement = false;
      },
      error: () => {
        this.documents = [...this.documentsDemo];
        this.appliquerFiltres();
        this.chargement = false;
      }
    });
  }

  private apiToDoc(d: DocumentAPI): Document {
    const raw = d as any;
    return {
      id:          d.id,
      type:        d.type        || '',
      titre:       d.titre       || '',
      reference:   d.reference   || '',
      date_doc:    d.dateDoc     || raw.date_doc    || '',
      contenu:     d.contenu     || '',
      fichier_url: this.normaliserUrl(d.fichierUrl  || raw.fichier_url),
      description: d.description || '',
      role_acces:  d.roleAcces   || raw.role_acces  || 'etudiant',
      statut:      (d.statut     || 'actif').toLowerCase(),
      created_at:  d.createdAt   || raw.created_at  || '',
      auteur_id:   d.auteur?.id  || 0,
      matiere:     d.matiere     || '',
      taille:      d.taille      || '',
    };
  }

  private normaliserUrl(url: string | undefined): string {
    if (!url || url.trim() === '') return '';
    if (url.startsWith('http') || url.startsWith('assets')) return url;
    // Nom de fichier simple → préfixe XAMPP complet
    return `${this.xamppUrl}/${url.replace(/^\//, '')}`;
  }

  // ─── Getters stats ────────────────────────────────────────────────────────
  get nbTotal()   { return this.documents.length; }
  get nbCours()   { return this.documents.filter(d => d.type === 'Cours').length; }
  get nbTP()      { return this.documents.filter(d => d.type === 'TP' || d.type === 'TD').length; }
  get nbExamens() { return this.documents.filter(d => d.type === 'Examen').length; }
  get nbDispo()   { return this.documents.filter(d => !!d.fichier_url || !!d.blobUrl).length; }

  // ─── Filtres & recherche ──────────────────────────────────────────────────
  filtrer(type: string) {
    this.filtreActif = type;
    this.appliquerFiltres();
  }

  onRecherche(event: Event) {
    this.recherche = (event.target as HTMLInputElement).value.toLowerCase();
    this.appliquerFiltres();
  }

  appliquerFiltres() {
    this.documentsFiltres = this.documents.filter(d => {
      const url = (d.fichier_url || d.fichierLocal?.name || '').toLowerCase();
      const matchType =
        this.filtreActif === 'tous' ||
        (this.filtreActif === 'pdf'    && url.endsWith('.pdf')) ||
        (this.filtreActif === 'doc'    && (url.endsWith('.doc') || url.endsWith('.docx'))) ||
        (this.filtreActif === 'ppt'    && (url.endsWith('.ppt') || url.endsWith('.pptx'))) ||
        (this.filtreActif === 'cours'  && d.type === 'Cours') ||
        (this.filtreActif === 'tp'     && (d.type === 'TP' || d.type === 'TD')) ||
        (this.filtreActif === 'examen' && d.type === 'Examen');

      const matchRecherche =
        !this.recherche ||
        d.titre.toLowerCase().includes(this.recherche) ||
        (d.description?.toLowerCase() ?? '').includes(this.recherche) ||
        (d.matiere?.toLowerCase() ?? '').includes(this.recherche) ||
        (d.reference?.toLowerCase() ?? '').includes(this.recherche);

      return matchType && matchRecherche;
    });
  }

  // ─── Téléchargement CORRIGÉ ───────────────────────────────────────────────
  telecharger(doc: Document) {
    // Cas 1 : fichier ajouté localement via le navigateur (blobUrl)
    if (doc.blobUrl) {
      const a = window.document.createElement('a');
      a.href = doc.blobUrl;
      a.download = doc.fichierLocal?.name ?? doc.titre;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      this.showToast('Téléchargement en cours...', 'success');
      return;
    }

    // Cas 2 : URL absolue (http://localhost/... ou https://...)
    if (doc.fichier_url && doc.fichier_url.startsWith('http')) {
      const a = window.document.createElement('a');
      a.href = doc.fichier_url;
      a.target = '_blank';
      a.download = doc.titre;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      this.showToast('Ouverture du document en cours...', 'success');
      return;
    }

    // Cas 3 : chemin relatif (assets/... ou /documents-unchk/...)
    if (doc.fichier_url && doc.fichier_url.trim() !== '') {
      const a = window.document.createElement('a');
      a.href = doc.fichier_url;
      a.target = '_blank';
      a.download = doc.titre;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      this.showToast('Ouverture du document en cours...', 'success');
      return;
    }

    // Cas 4 : aucun fichier disponible
    this.showToast(`"${doc.titre}" n'a pas encore de fichier joint.`, 'warning');
  }

  private showToast(msg: string, type: 'success' | 'info' | 'warning' = 'info') {
    this.toastMessage = msg;
    this.toastType = type;
    this.toastVisible = true;
    setTimeout(() => (this.toastVisible = false), 3500);
  }

  // ─── Modal ajout ──────────────────────────────────────────────────────────
  ouvrirModal() {
    this.nouveauDoc = {
      titre: '', type: 'Cours', matiere: '', reference: '',
      date_doc: new Date().toISOString().split('T')[0],
      description: '', statut: 'actif', fichier: null,
    };
    this.fichierSelectionne = null;
    this.nomFichierAffiche = '';
    this.msgSucces = '';
    this.msgErreurForm = '';
    this.modalOuvert = true;
  }

  fermerModal() {
    this.modalOuvert = false;
  }

  onFichierChange(event: Event | DragEvent) {
    let files: FileList | null = null;
    if (event instanceof DragEvent) {
      files = event.dataTransfer?.files ?? null;
    } else {
      files = (event.target as HTMLInputElement).files;
    }
    if (files && files.length > 0) {
      this.fichierSelectionne = files[0];
      this.nomFichierAffiche = this.fichierSelectionne.name;
      this.nouveauDoc.fichier = this.fichierSelectionne;
      if (!this.nouveauDoc.reference) {
        const ext = this.fichierSelectionne.name.split('.').pop()?.toUpperCase() ?? 'DOC';
        this.nouveauDoc.reference = `${ext}-${Date.now()}`;
      }
    }
  }

  supprimerFichier() {
    this.fichierSelectionne = null;
    this.nomFichierAffiche = '';
    this.nouveauDoc.fichier = null;
  }

  validerFormulaire(): boolean {
    if (!this.nouveauDoc.titre.trim()) {
      this.msgErreurForm = 'Le titre est obligatoire.';
      return false;
    }
    if (!this.nouveauDoc.type) {
      this.msgErreurForm = 'Veuillez choisir un type.';
      return false;
    }
    this.msgErreurForm = '';
    return true;
  }

  soumettre() {
    if (!this.validerFormulaire()) return;
    this.enEnvoi = true;

    if (this.fichierSelectionne) {
      const formData = new FormData();
      formData.append('fichier', this.fichierSelectionne);
      formData.append('titre', this.nouveauDoc.titre);
      formData.append('type', this.nouveauDoc.type);
      formData.append('matiere', this.nouveauDoc.matiere);
      formData.append('reference', this.nouveauDoc.reference);
      formData.append('date_doc', this.nouveauDoc.date_doc);
      formData.append('description', this.nouveauDoc.description);
      formData.append('statut', this.nouveauDoc.statut);
      formData.append('role_acces', 'etudiant');

      this.http.post<Document>(`${this.apiUrl}/upload`, formData).subscribe({
        next: (doc) => {
          this.documents.unshift(doc);
          this.appliquerFiltres();
          this.enEnvoi = false;
          this.msgSucces = 'Document ajouté avec succès !';
          setTimeout(() => this.fermerModal(), 1500);
        },
        error: () => this.ajouterLocalement(),
      });
    } else {
      this.http.post<Document>(`${this.apiUrl}`, {
        titre: this.nouveauDoc.titre, type: this.nouveauDoc.type,
        matiere: this.nouveauDoc.matiere, reference: this.nouveauDoc.reference,
        date_doc: this.nouveauDoc.date_doc, description: this.nouveauDoc.description,
        statut: this.nouveauDoc.statut, role_acces: 'etudiant', fichier_url: '',
      }).subscribe({
        next: (doc) => {
          this.documents.unshift(doc);
          this.appliquerFiltres();
          this.enEnvoi = false;
          this.msgSucces = 'Document ajouté avec succès !';
          setTimeout(() => this.fermerModal(), 1500);
        },
        error: () => this.ajouterLocalement(),
      });
    }
  }

  private ajouterLocalement() {
    const taille = this.fichierSelectionne
      ? `${(this.fichierSelectionne.size / (1024 * 1024)).toFixed(1)} Mo` : '';
    const blobUrl = this.fichierSelectionne
      ? URL.createObjectURL(this.fichierSelectionne) : undefined;

    const doc: Document = {
      id: this.prochainId++,
      type: this.nouveauDoc.type,
      titre: this.nouveauDoc.titre,
      reference: this.nouveauDoc.reference || `REF-${Date.now()}`,
      date_doc: this.nouveauDoc.date_doc || new Date().toISOString().split('T')[0],
      contenu: '',
      fichier_url: this.fichierSelectionne ? this.fichierSelectionne.name : '',
      description: this.nouveauDoc.description,
      role_acces: 'etudiant',
      statut: this.nouveauDoc.statut,
      created_at: new Date().toISOString(),
      auteur_id: 0,
      matiere: this.nouveauDoc.matiere,
      taille,
      fichierLocal: this.fichierSelectionne ?? undefined,
      blobUrl,
    };

    this.documents.unshift(doc);
    this.appliquerFiltres();
    this.enEnvoi = false;
    this.msgSucces = 'Document ajouté localement !';
    setTimeout(() => this.fermerModal(), 1500);
  }

  // ─── Suppression ──────────────────────────────────────────────────────────
  supprimerDocument(doc: Document) {
    if (!confirm(`Supprimer "${doc.titre}" ?`)) return;
    if (doc.blobUrl) URL.revokeObjectURL(doc.blobUrl);
    this.documents = this.documents.filter(d => d.id !== doc.id);
    this.appliquerFiltres();
  }

  // ─── Utilitaires ──────────────────────────────────────────────────────────
  getExt(fichier_url: string): string {
    if (!fichier_url) return 'FILE';
    return (fichier_url.split('.').pop() || 'FILE').toUpperCase();
  }

  getExtFromDoc(doc: Document): string {
    const name = doc.fichier_url || doc.fichierLocal?.name || '';
    return this.getExt(name);
  }

  getExtClass(fichier_url: string): string {
    const ext = fichier_url?.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (ext === 'doc' || ext === 'docx') return 'doc';
    if (ext === 'ppt' || ext === 'pptx') return 'ppt';
    if (ext === 'xls' || ext === 'xlsx') return 'xls';
    return 'pdf';
  }

  getExtClassFromDoc(doc: Document): string {
    const name = doc.fichier_url || doc.fichierLocal?.name || '';
    if (!name) return 'no-file';
    return this.getExtClass(name);
  }

  hasFichier(doc: Document): boolean {
    return !!(doc.fichier_url?.trim() || doc.blobUrl);
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'Cours': 'menu_book', 'TP': 'science', 'TD': 'edit_note',
      'Examen': 'quiz', 'Note de service': 'description',
      'Circulaire': 'article', 'Autre': 'insert_drive_file',
    };
    return icons[type] || 'insert_drive_file';
  }

  getTypeBadgeClass(type: string): string {
    const classes: Record<string, string> = {
      'Cours': 'type-cours', 'TP': 'type-tp', 'TD': 'type-td',
      'Examen': 'type-examen', 'Note de service': 'type-note',
      'Circulaire': 'type-circ', 'Autre': 'type-autre',
    };
    return classes[type] || 'type-autre';
  }

  formaterDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR');
  }

  formatTailleFichier(fichier: File): string {
    const mo = fichier.size / (1024 * 1024);
    return mo < 1 ? `${(fichier.size / 1024).toFixed(0)} Ko` : `${mo.toFixed(1)} Mo`;
  }
}
