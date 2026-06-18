import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatTooltipModule, MatSnackBarModule,
    MatDatepickerModule, MatNativeDateModule,
    RouterModule, MatToolbarModule,
    SidebarComponent
  ],
  templateUrl: './documents.html',
  styleUrl: './documents.css'
})
export class DocumentsComponent implements OnInit {

  apiUrl = 'http://localhost:8080/api/documents';
  documents: any[] = [];
  filteredDocuments: any[] = [];
  isLoading = true;
  showForm = false;
  editMode = false;
  searchText = '';
  currentFilter = '';
  selectedFileName = '';
  selectedFile: File | null = null;

  types = [
    'Courrier arrivé', 'Courrier départ', 'Note de service',
    'Note administrative', 'Circulaire', 'Budget', 'Autre'
  ];
  rolesAcces = ['Tous', 'Admin', 'Enseignant', 'Etudiant'];
  statuts = ['Actif', 'Archivé'];

  document: any = this.emptyDocument();

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadDocuments();
  }

  emptyDocument() {
    return {
      titre: '', type: '', reference: '', dateDoc: null,
      description: '', contenu: '', fichierUrl: '',
      roleAcces: 'Tous', statut: 'Actif'
    };
  }

  // ── STATS ──────────────────────────────────────────
  getActifs(): number {
    return this.documents.filter(d => d.statut === 'Actif').length;
  }

  getArchives(): number {
    return this.documents.filter(d => d.statut === 'Archivé').length;
  }

  getCount(type: string): number {
    return this.documents.filter(d => d.type === type).length;
  }

  // ── ICONES ─────────────────────────────────────────
  getTypeIcon(type: string): string {
    if (type === 'Courrier arrivé')     return 'move_to_inbox';
    if (type === 'Courrier départ')     return 'outbox';
    if (type === 'Note de service')     return 'sticky_note_2';
    if (type === 'Note administrative') return 'note_alt';
    if (type === 'Circulaire')          return 'campaign';
    if (type === 'Budget')              return 'account_balance_wallet';
    return 'description';
  }

  getTypeColor(type: string): string {
    if (type === 'Courrier arrivé')     return 'bleu';
    if (type === 'Courrier départ')     return 'vert';
    if (type === 'Note de service')     return 'orange';
    if (type === 'Note administrative') return 'rouge';
    if (type === 'Circulaire')          return 'violet';
    if (type === 'Budget')              return 'jaune';
    return 'gris';
  }

  // ── FILTRES ────────────────────────────────────────
  filterType(type: string) {
    this.currentFilter = type;
    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.documents];
    if (this.currentFilter) {
      result = result.filter(d => d.type === this.currentFilter);
    }
    if (this.searchText) {
      const s = this.searchText.toLowerCase();
      result = result.filter(d =>
        d.titre?.toLowerCase().includes(s) ||
        d.type?.toLowerCase().includes(s) ||
        d.reference?.toLowerCase().includes(s) ||
        d.description?.toLowerCase().includes(s)
      );
    }
    this.filteredDocuments = result;
  }

  filterSearch() {
    this.applyFilters();
  }

  // ── CHARGEMENT ─────────────────────────────────────
 loadDocuments() {
   this.isLoading = true;
   this.http.get<any[]>(this.apiUrl).subscribe({
     next: (data) => {
       this.documents = data;
       this.filteredDocuments = [...data];  // ← spread
       this.isLoading = false;
       this.cdr.detectChanges();            // ← force le re-render
     },
     error: () => {
       this.isLoading = false;
       this.snackBar.open('❌ Erreur de chargement !', 'Fermer', { duration: 3000 });
     }
   });
 }

  // ── OUVRIR FICHIER ─────────────────────────────────
  ouvrirFichier(d: any) {
    const url = d.fichier_url;
    if (url) {
      window.open(url, '_blank');
    }
  }

  // ── FORMULAIRE ─────────────────────────────────────
  openForm() {
    this.editMode = false;
    this.document = this.emptyDocument();
    this.selectedFileName = '';
    this.selectedFile = null;
    this.showForm = true;
  }

  editDocument(d: any) {
    this.document = { ...d };
    this.editMode = true;
    this.showForm = true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

  // ── SAVE ───────────────────────────────────────────
  saveDocument() {
    if (!this.document.titre || !this.document.type) {
      this.snackBar.open('⚠️ Titre et type sont obligatoires !',
        'Fermer', { duration: 3000 });
      return;
    }

    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.http.post(`${this.apiUrl}/upload`,
        formData, { responseType: 'text' }
      ).subscribe({
        next: (url) => {
          this.document.fichierUrl = url;
          this.enregistrerDocument();
        },
        error: () => {
          this.snackBar.open('❌ Erreur upload fichier !',
            'Fermer', { duration: 3000 });
        }
      });
    } else {
      this.enregistrerDocument();
    }
  }

  enregistrerDocument() {
    const req = this.editMode
      ? this.http.put(`${this.apiUrl}/${this.document.id}`, this.document)
      : this.http.post(this.apiUrl, this.document);

    req.subscribe({
      next: () => {
        this.showForm = false;
        this.selectedFile = null;
        this.selectedFileName = '';
        this.loadDocuments();
        this.snackBar.open(
          this.editMode ? '✅ Document modifié !' : '✅ Document ajouté !',
          'Fermer', { duration: 3000, panelClass: ['snack-success'] }
        );
      },
      error: () => {
        this.snackBar.open('❌ Erreur lors de l\'enregistrement !',
          'Fermer', { duration: 3000 });
      }
    });
  }

  // ── DELETE ─────────────────────────────────────────
  deleteDocument(id: number) {
    this.snackBar.open('⚠️ Supprimer ce document ?', 'Supprimer', {
      duration: 5000, panelClass: ['snack-warning']
    }).onAction().subscribe(() => {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          this.loadDocuments();
          this.snackBar.open('🗑️ Document supprimé !',
            'Fermer', { duration: 3000 });
        }
      });
    });
  }

  // ── ARCHIVER ───────────────────────────────────────
  archiverDocument(id: number) {
    this.http.put(`${this.apiUrl}/${id}/archiver`, {}).subscribe({
      next: () => {
        this.loadDocuments();
        this.snackBar.open('📦 Document archivé !',
          'Fermer', { duration: 3000 });
      }
    });
  }

  // ── STATUT ─────────────────────────────────────────
  getStatutClass(statut: string) {
    return {
      'actif':   statut === 'Actif',
      'archive': statut === 'Archivé'
    };
  }

  // ── GÉNÉRER FICHE PDF ──────────────────────────────
  async telecharger(d: any) {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;

    const bleuFonce: [number, number, number] = [26, 58, 92];
    const bleuClair: [number, number, number] = [33, 150, 243];
    const blanc: [number, number, number] = [255, 255, 255];
    const grisClair: [number, number, number] = [245, 247, 250];
    const grisTexte: [number, number, number] = [60, 60, 60];

    doc.setFillColor(...bleuFonce);
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setFillColor(...bleuClair);
    doc.rect(0, 35, pageWidth, 3, 'F');

    try {
      const logo = new Image();
      logo.src = 'logoUnchk.png';
      await new Promise(resolve => {
        logo.onload = resolve;
        logo.onerror = resolve;
        setTimeout(resolve, 2000);
      });
      if (logo.complete && logo.naturalWidth > 0) {
        doc.addImage(logo, 'PNG', margin, 7, 18, 18);
      }
    } catch (e) {}

    doc.setDrawColor(...bleuClair);
    doc.setLineWidth(0.5);
    doc.line(margin + 22, 8, margin + 22, 30);

    doc.setTextColor(...blanc);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('UNIVERSITÉ NUMÉRIQUE CHEIKH HAMIDOU KANE', margin + 27, 16);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('DIRECTION DES AFFAIRES ACADÉMIQUES', margin + 27, 22);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(180, 210, 255);
    doc.text("L'excellence pédagogique au service du numérique", margin + 27, 28);

    let y = 48;
    doc.setTextColor(...bleuFonce);
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    const titreType = `DOCUMENT — ${(d.type || '').toUpperCase()}`;
    doc.text(titreType, pageWidth / 2, y, { align: 'center' });

    y += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grisTexte);
    doc.text(d.titre || '', pageWidth / 2, y, { align: 'center' });

    y += 12;
    const boxW = (pageWidth - margin * 2 - 9) / 4;
    const boxes = [
      { label: 'DATE',      value: d.date_doc ? new Date(d.date_doc).toLocaleDateString('fr-FR') : 'Non définie' },
      { label: 'RÉFÉRENCE', value: d.reference || 'Non définie' },
      { label: 'TYPE',      value: d.type || 'Non défini' },
      { label: 'STATUT',    value: d.statut || 'Non défini' }
    ];

    boxes.forEach((box, i) => {
      const x = margin + i * (boxW + 3);
      doc.setFillColor(...grisClair);
      doc.roundedRect(x, y, boxW, 22, 3, 3, 'F');
      doc.setFillColor(...bleuClair);
      doc.roundedRect(x, y, boxW, 2, 1, 1, 'F');
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...bleuClair);
      doc.text(box.label, x + boxW / 2, y + 8, { align: 'center' });
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...grisTexte);
      const lines = doc.splitTextToSize(box.value, boxW - 4);
      doc.text(lines[0], x + boxW / 2, y + 15, { align: 'center' });
      if (lines[1]) doc.text(lines[1], x + boxW / 2, y + 19, { align: 'center' });
    });

    y += 30;

    const addSection = (title: string, content: string) => {
      if (y > pageHeight - 60) { doc.addPage(); y = 20; }
      doc.setFillColor(...bleuFonce);
      doc.roundedRect(margin, y, pageWidth - margin * 2, 9, 2, 2, 'F');
      doc.setFillColor(...bleuClair);
      doc.roundedRect(margin, y, 4, 9, 2, 2, 'F');
      doc.setTextColor(...blanc);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin + 8, y + 6);
      y += 13;
      doc.setTextColor(...grisTexte);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(content || 'Non renseigné', pageWidth - margin * 2 - 6);
      lines.forEach((line: string) => {
        if (y > pageHeight - 40) { doc.addPage(); y = 20; }
        doc.text(line, margin + 3, y);
        y += 5.5;
      });
      y += 6;
    };

    addSection('DESCRIPTION', d.description || '');
    addSection('CONTENU', d.contenu || '');
    addSection('ACCÈS', `Rôle : ${d.role_acces || 'Tous'}`);

    doc.setFillColor(...bleuFonce);
    doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');
    doc.setFillColor(...bleuClair);
    doc.rect(0, pageHeight - 14, pageWidth, 2, 'F');
    doc.setTextColor(...blanc);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Université Numérique Cheikh Hamidou Kane  |  www.unchk.sn  |  Document Officiel',
      pageWidth / 2, pageHeight - 5, { align: 'center' }
    );

    const nomFichier = `DOC_${(d.titre || 'document').replace(/\s+/g, '_')}_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.pdf`;
    doc.save(nomFichier);
    this.snackBar.open('✅ Fiche PDF générée !', 'Fermer', { duration: 3000 });
  }
}
