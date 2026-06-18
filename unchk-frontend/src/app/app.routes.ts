import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { EtudiantsComponent } from './pages/etudiants/etudiants';
import { FormateursComponent } from './pages/formateurs/formateurs';
import { FormationsComponent } from './pages/formations/formations';
import { DocumentsComponent } from './pages/documents/documents';
import { InscriptionComponent } from './pages/inscription/inscription';
import { DashboardEtudiantComponent } from './pages/dashboard-etudiant/dashboard-etudiant';
import { DashboardFormateurComponent } from './pages/dashboard-formateur/dashboard-formateur';
import { ComptesRendusComponent } from './pages/comptes-rendus/comptes-rendus';
import { InsertionProComponent } from './pages/insertion-pro/insertion-pro';
import { UtilisateursComponent } from './pages/utilisateurs/utilisateurs';
import { EmploiDuTemps } from './pages/emploi-du-temps/emploi-du-temps';
import { MesDevoirs } from './pages/mes-devoirs/mes-devoirs';
import { ExamensEtudiant } from './pages/examens-etudiant/examens-etudiant';
import { MesDocuments } from './pages/mes-documents/mes-documents';
import { AnnoncesAdminComponent } from './pages/annonces-admin/annonces-admin';
import { MonProfil } from './pages/mon-profil/mon-profil';
import { MesCoursComponent } from './pages/mes-cours/mes-cours';
import { EmploiDuTempsFormateurComponent } from './pages/emploi-du-temps-formateur/emploi-du-temps-formateur';
import { MesEtudiantsComponent } from './pages/mes-etudiants/mes-etudiants';
import { DevoirsFormateurComponent } from './pages/devoirs-formateur/devoirs-formateur';
import { DocumentsFormateurComponent } from './pages/documents-formateur/documents-formateur';
import { AnnoncesFormateurComponent } from './pages/annonces-formateur/annonces-formateur';
import { MesNotes } from './pages/mes-notes/mes-notes';


export const routes: Routes = [
  // ── AUTH ───────────────────────────────────────────
  { path: '',                          redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',                     component: LoginComponent },
  { path: 'inscription',               component: InscriptionComponent },

  // dans le tableau routes, section ÉTUDIANT :
  { path: 'mes-notes', component: MesNotes },


  // ── ADMIN ──────────────────────────────────────────
  { path: 'dashboard',                 component: DashboardComponent },
  { path: 'etudiants',                 component: EtudiantsComponent },
  { path: 'formateurs',                component: FormateursComponent },
  { path: 'formations',                component: FormationsComponent },
  { path: 'documents',                 component: DocumentsComponent },
  { path: 'comptes-rendus',            component: ComptesRendusComponent },
  { path: 'insertion',                 component: InsertionProComponent },
  { path: 'utilisateurs',              component: UtilisateursComponent },

  // ── ETUDIANT ───────────────────────────────────────
  { path: 'dashboard-etudiant',        component: DashboardEtudiantComponent },
  { path: 'emploi-du-temps',           component: EmploiDuTemps },
  { path: 'mes-devoirs',               component: MesDevoirs },
  { path: 'examens-etudiant',          component: ExamensEtudiant },
  { path: 'mes-documents',             component: MesDocuments },
 { path: 'annonces', component: AnnoncesAdminComponent },
  { path: 'mon-profil',                component: MonProfil },

  // ── FORMATEUR ──────────────────────────────────────
  { path: 'dashboard-formateur',       component: DashboardFormateurComponent },
  { path: 'mes-cours',                 component: MesCoursComponent },
  { path: 'emploi-du-temps-formateur', component: EmploiDuTempsFormateurComponent },
  { path: 'mes-etudiants',             component: MesEtudiantsComponent },
  { path: 'devoirs-formateur',         component: DevoirsFormateurComponent },
  { path: 'documents-formateur',       component: DocumentsFormateurComponent },
  { path: 'annonces-formateur',        component: AnnoncesFormateurComponent },

  // ── FALLBACK ───────────────────────────────────────
  { path: '**',                        redirectTo: 'login' },
];
