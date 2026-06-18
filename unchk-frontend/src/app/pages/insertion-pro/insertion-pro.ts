import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SidebarComponent } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-insertion-pro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatSnackBarModule,
    SidebarComponent  // ← ajoute ici
  ],
  templateUrl: './insertion-pro.html',
  styleUrl: './insertion-pro.css'
})
export class InsertionProComponent implements OnInit {

  activeTab = 'stages';

  // STAGES
  stages: any[] = [];
  showStageForm = false;
  stageEditMode = false;
  stageColumns = ['etudiant', 'entreprise', 'poste', 'dateDebut', 'dateFin', 'note', 'actions'];

  stage: any = this.emptyStage();

  // INSERTIONS
  insertions: any[] = [];
  showInsertionForm = false;
  insertion: any = this.emptyInsertion();

  // PARTENAIRES
  partenaires: any[] = [];
  showPartenaireForm = false;
  partenaire: any = this.emptyPartenaire();

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadStages();
    this.loadInsertions();
    this.loadPartenaires();
  }

  emptyStage() {
    return { etudiantNom: '', entreprise: '', poste: '', dateDebut: null, dateFin: null, note: null, bilan: '' };
  }

  emptyInsertion() {
    return { etudiantNom: '', type: '', entreprise: '', poste: '', dateDebut: null };
  }

  emptyPartenaire() {
    return { nom: '', type: '', domaine: '', contactNom: '', telephone: '', email: '' };
  }

  getInsertionLabel(type: string): string {
    const labels: any = {
      'emploi_salarie': 'Emploi salarié',
      'auto_emploi': 'Auto-emploi',
      'poursuite_etudes': 'Poursuite études',
      'autre': 'Autre'
    };
    return labels[type] || type;
  }

  // ---- STAGES ----
  loadStages() {
    this.stages = [
      { id: 1, etudiantNom: 'Sonia Mbaye', entreprise: 'Orange Sénégal', poste: 'Développeur Web', dateDebut: '2026-01-15', dateFin: '2026-04-15', note: 16, bilan: 'Très bon stage' },
      { id: 2, etudiantNom: 'Mamadou Diop', entreprise: 'Sonatel', poste: 'Réseau & Télécom', dateDebut: '2026-02-01', dateFin: '2026-05-01', note: 14, bilan: 'Bon stage' },
    ];
  }

  openStageForm() {
    this.stageEditMode = false;
    this.stage = this.emptyStage();
    setTimeout(() => { this.showStageForm = true; this.cdr.detectChanges(); }, 0);
  }

  editStage(s: any) {
    this.stage = { ...s };
    this.stageEditMode = true;
    setTimeout(() => { this.showStageForm = true; this.cdr.detectChanges(); }, 0);
  }

  saveStage() {
    if (this.stageEditMode) {
      const index = this.stages.findIndex(s => s.id === this.stage.id);
      if (index !== -1) this.stages[index] = { ...this.stage };
    } else {
      this.stages.push({ ...this.stage, id: Date.now() });
    }
    this.showStageForm = false;
    this.snackBar.open('✅ Stage enregistré !', 'Fermer', { duration: 3000, panelClass: ['snack-success'] });
  }

  deleteStage(id: number) {
    this.snackBar.open('⚠️ Supprimer ce stage ?', 'Supprimer', {
      duration: 5000, panelClass: ['snack-warning']
    }).onAction().subscribe(() => {
      this.stages = this.stages.filter(s => s.id !== id);
      this.snackBar.open('🗑️ Stage supprimé !', 'Fermer', { duration: 3000, panelClass: ['snack-error'] });
    });
  }

  // ---- INSERTIONS ----
  loadInsertions() {
    this.insertions = [
      { id: 1, etudiantNom: 'Fatou Fall', type: 'emploi_salarie', entreprise: 'Expresso', poste: 'Ingénieur Réseau', dateDebut: '2025-09-01' },
      { id: 2, etudiantNom: 'Ibrahima Sow', type: 'auto_emploi', entreprise: 'DevSénégal SARL', poste: 'Gérant', dateDebut: '2025-11-01' },
    ];
  }

  openInsertionForm() {
    this.insertion = this.emptyInsertion();
    setTimeout(() => { this.showInsertionForm = true; this.cdr.detectChanges(); }, 0);
  }

  saveInsertion() {
    this.insertions.push({ ...this.insertion, id: Date.now() });
    this.showInsertionForm = false;
    this.snackBar.open('✅ Insertion enregistrée !', 'Fermer', { duration: 3000, panelClass: ['snack-success'] });
  }

  deleteInsertion(id: number) {
    this.snackBar.open('⚠️ Supprimer cette insertion ?', 'Supprimer', {
      duration: 5000, panelClass: ['snack-warning']
    }).onAction().subscribe(() => {
      this.insertions = this.insertions.filter(i => i.id !== id);
      this.snackBar.open('🗑️ Insertion supprimée !', 'Fermer', { duration: 3000, panelClass: ['snack-error'] });
    });
  }

  // ---- PARTENAIRES ----
  loadPartenaires() {
    this.partenaires = [
      { id: 1, nom: 'Orange Sénégal', type: 'entreprise', domaine: 'Télécommunications', contactNom: 'Moussa Diallo', telephone: '33 800 00 00', email: 'partenariat@orange.sn' },
      { id: 2, nom: 'Sonatel', type: 'entreprise', domaine: 'Télécommunications', contactNom: 'Awa Ndiaye', telephone: '33 839 00 00', email: 'rh@sonatel.sn' },
      { id: 3, nom: 'Agence Sénégalaise pour la Promotion des Exportations', type: 'institution', domaine: 'Commerce', contactNom: 'Cheikh Ba', telephone: '33 869 00 00', email: 'contact@asepex.sn' },
    ];
  }

  openPartenaireForm() {
    this.partenaire = this.emptyPartenaire();
    setTimeout(() => { this.showPartenaireForm = true; this.cdr.detectChanges(); }, 0);
  }

  savePartenaire() {
    this.partenaires.push({ ...this.partenaire, id: Date.now() });
    this.showPartenaireForm = false;
    this.snackBar.open('✅ Partenaire ajouté !', 'Fermer', { duration: 3000, panelClass: ['snack-success'] });
  }

  deletePartenaire(id: number) {
    this.snackBar.open('⚠️ Supprimer ce partenaire ?', 'Supprimer', {
      duration: 5000, panelClass: ['snack-warning']
    }).onAction().subscribe(() => {
      this.partenaires = this.partenaires.filter(p => p.id !== id);
      this.snackBar.open('🗑️ Partenaire supprimé !', 'Fermer', { duration: 3000, panelClass: ['snack-error'] });
    });
  }
}
