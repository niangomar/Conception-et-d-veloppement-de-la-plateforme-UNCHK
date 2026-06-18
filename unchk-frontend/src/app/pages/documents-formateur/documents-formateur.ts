import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

interface DocumentFormateur {
  id: number;
  nom: string;
  cours: string;
  formation: string;
  type: string;
  taille: string;
  date: string;
  color: string;
  icon: string;
  statut: string;
  file?: File;
}

@Component({
  selector: 'app-documents-formateur',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule,FormsModule],
  templateUrl: './documents-formateur.html',
  styleUrl: './documents-formateur.css',
})
export class DocumentsFormateurComponent implements OnInit {

  prenomUtilisateur = '';
  nomUtilisateur    = '';

  filtreActif = 'tous';
  dragOver = false;

  extensionsAutorisees = ['pdf', 'pptx', 'ppt', 'docx', 'doc', 'zip'];
  tailleMaxOctets = 20 * 1024 * 1024; // 20 Mo

  // --- Edition inline ---
  editingId: number | null = null;
  editForm = { nom: '', cours: '', formation: '', statut: 'brouillon' };

  documents: DocumentFormateur[] = [
    {
      id: 1, nom: 'Cours_Algo_Chapitre1.pdf', cours: 'Algorithmique',
      formation: 'Licence 2 Info', type: 'pdf', taille: '2.4 Mo',
      date: '10 Juin 2026', color: 'blue', icon: 'picture_as_pdf', statut: 'publie'
    },
    {
      id: 2, nom: 'TP2_Tri_Rapide.zip', cours: 'Algorithmique',
      formation: 'Licence 2 Info', type: 'zip', taille: '1.1 Mo',
      date: '12 Juin 2026', color: 'blue', icon: 'folder_zip', statut: 'publie'
    },
    {
      id: 3, nom: 'Slides_SQL_Avance.pptx', cours: 'Base de données',
      formation: 'Master 1 Info', type: 'pptx', taille: '5.8 Mo',
      date: '08 Juin 2026', color: 'green', icon: 'slideshow', statut: 'publie'
    },
    {
      id: 4, nom: 'TD3_Joins_Correction.pdf', cours: 'Base de données',
      formation: 'Master 1 Info', type: 'pdf', taille: '0.9 Mo',
      date: '14 Juin 2026', color: 'green', icon: 'picture_as_pdf', statut: 'brouillon'
    },
    {
      id: 5, nom: 'Cours_Arbres_AVL.pdf', cours: 'Structures de données',
      formation: 'Licence 3 Info', type: 'pdf', taille: '3.2 Mo',
      date: '05 Juin 2026', color: 'purple', icon: 'picture_as_pdf', statut: 'publie'
    },
    {
      id: 6, nom: 'Exercices_Graphes.docx', cours: 'Structures de données',
      formation: 'Licence 3 Info', type: 'docx', taille: '0.6 Mo',
      date: '13 Juin 2026', color: 'purple', icon: 'description', statut: 'publie'
    },
  ];

  get documentsFiltres() {
    if (this.filtreActif === 'tous') return this.documents;
    return this.documents.filter(d => d.statut === this.filtreActif);
  }

  get nbPublies()    { return this.documents.filter(d => d.statut === 'publie').length; }
  get nbBrouillons() { return this.documents.filter(d => d.statut === 'brouillon').length; }

  filtrer(f: string) { this.filtreActif = f; }

  onDragOver(e: DragEvent) { e.preventDefault(); this.dragOver = true; }
  onDragLeave()            { this.dragOver = false; }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.dragOver = false;
    this.handleFiles(e.dataTransfer?.files ?? null);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.handleFiles(input.files);
    input.value = '';
  }

  private handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    Array.from(fileList).forEach(file => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';

      if (!this.extensionsAutorisees.includes(ext)) {
        alert(`Le fichier "${file.name}" n'est pas dans un format autorisé (PDF, PPTX, DOCX, ZIP).`);
        return;
      }
      if (file.size > this.tailleMaxOctets) {
        alert(`Le fichier "${file.name}" dépasse la taille maximale de 20 Mo.`);
        return;
      }

      const { icon, type } = this.infosExtension(ext);
      const colors: any = { pdf: 'blue', pptx: 'green', docx: 'purple', zip: 'orange' };

      const nouveauDoc: DocumentFormateur = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        nom: file.name,
        cours: 'À classer',
        formation: '—',
        type,
        taille: this.formatTaille(file.size),
        date: this.formatDate(new Date()),
        color: colors[type] || 'grey',
        icon,
        statut: 'brouillon',
        file,
      };

      this.documents.unshift(nouveauDoc);
    });
  }

  private infosExtension(ext: string): { icon: string; type: string } {
    const map: Record<string, { icon: string; type: string }> = {
      pdf:  { icon: 'picture_as_pdf', type: 'pdf' },
      pptx: { icon: 'slideshow',      type: 'pptx' },
      ppt:  { icon: 'slideshow',      type: 'pptx' },
      docx: { icon: 'description',    type: 'docx' },
      doc:  { icon: 'description',    type: 'docx' },
      zip:  { icon: 'folder_zip',     type: 'zip' },
    };
    return map[ext] || { icon: 'insert_drive_file', type: 'zip' };
  }

 private formatTaille(bytes: number): string {
   if (bytes < 1024 * 1024) {
     const ko = bytes / 1024;
     return (ko < 1 ? ko.toFixed(2) : ko.toFixed(0)) + ' Ko';
   }
   return (bytes / (1024 * 1024)).toFixed(2) + ' Mo';
 }

  private formatDate(date: Date): string {
    const mois = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    return `${date.getDate().toString().padStart(2, '0')} ${mois[date.getMonth()]} ${date.getFullYear()}`;
  }

  getTypeColor(type: string) {
    const colors: any = { 'pdf': 'red', 'pptx': 'orange', 'docx': 'blue', 'zip': 'grey' };
    return colors[type] || 'grey';
  }

  // --- Téléchargement ---
  downloadDoc(d: DocumentFormateur) {
    if (d.file) {
      const url = URL.createObjectURL(d.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = d.nom;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      alert(`"${d.nom}" est un document de démonstration sans fichier réel associé.\nUne fois le backend connecté, ce bouton téléchargera le vrai fichier stocké côté serveur.`);
    }
  }

  // --- Edition inline ---
  startEdit(d: DocumentFormateur) {
    this.editingId = d.id;
    this.editForm = { nom: d.nom, cours: d.cours, formation: d.formation, statut: d.statut };
  }

  cancelEdit() {
    this.editingId = null;
  }

  saveEdit(d: DocumentFormateur) {
    if (!this.editForm.nom.trim()) {
      alert('Le nom du document ne peut pas être vide.');
      return;
    }
    d.nom       = this.editForm.nom.trim();
    d.cours     = this.editForm.cours.trim() || 'À classer';
    d.formation = this.editForm.formation.trim() || '—';
    d.statut    = this.editForm.statut;
    this.editingId = null;
  }

  // --- Suppression ---
  deleteDoc(d: DocumentFormateur) {
    const confirme = confirm(`Supprimer définitivement "${d.nom}" ?`);
    if (!confirme) return;
    this.documents = this.documents.filter(doc => doc.id !== d.id);
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
