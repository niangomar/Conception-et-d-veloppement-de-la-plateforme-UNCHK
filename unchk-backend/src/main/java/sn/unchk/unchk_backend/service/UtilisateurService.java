package sn.unchk.unchk_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sn.unchk.unchk_backend.entity.Utilisateur;
import sn.unchk.unchk_backend.entity.Formateur;
import sn.unchk.unchk_backend.entity.Etudiant;
import sn.unchk.unchk_backend.repository.UtilisateurRepository;
import sn.unchk.unchk_backend.repository.FormateurRepository;
import sn.unchk.unchk_backend.repository.EtudiantRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final FormateurRepository formateurRepository;
    private final EtudiantRepository etudiantRepository;
    private final PasswordEncoder passwordEncoder; // ✅ AJOUT

    // Récupérer tous les utilisateurs
    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();
    }

    // Récupérer par ID
    public Utilisateur getById(Long id) {
        return utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'id : " + id));
    }

    // Récupérer les comptes en attente
    public List<Utilisateur> getEnAttente() {
        return utilisateurRepository.findByStatut("EN_ATTENTE");
    }

    // Créer un utilisateur — statut EN_ATTENTE par défaut
    public Utilisateur createUtilisateur(Utilisateur utilisateur) {

        if (utilisateurRepository.existsByEmail(utilisateur.getEmail())) {
            throw new RuntimeException("Email déjà utilisé : " + utilisateur.getEmail());
        }

        // ✅ Hacher le mot de passe avant de sauvegarder
        utilisateur.setMotDePasse(passwordEncoder.encode(utilisateur.getMotDePasse()));

        utilisateur.setCreatedAt(LocalDateTime.now());
        utilisateur.setStatut("EN_ATTENTE");
        utilisateur.setActif(false);

        return utilisateurRepository.save(utilisateur);
    }

    // Approuver un utilisateur
    public Utilisateur approuver(Long id) {
        Utilisateur u = getById(id);
        u.setStatut("ACTIF");
        u.setActif(true);

        String role = u.getRole();
        if (role != null) {
            switch (role.toLowerCase()) {
                case "enseignant":
                case "enseignant associé":
                case "tuteur":
                case "responsable":
                    if (!formateurRepository.existsByEmail(u.getEmail())) {
                        Formateur formateur = new Formateur();
                        formateur.setNom(u.getNom());
                        formateur.setPrenom(u.getPrenom());
                        formateur.setEmail(u.getEmail());
                        formateur.setType(capitalizeRole(role));
                        formateur.setStatut("Actif");
                        formateurRepository.save(formateur);
                    }
                    break;
                case "etudiant":
                    if (!etudiantRepository.existsByEmail(u.getEmail())) {
                        Etudiant etudiant = new Etudiant();
                        etudiant.setNom(u.getNom());
                        etudiant.setPrenom(u.getPrenom());
                        etudiant.setEmail(u.getEmail());
                        etudiant.setStatut("Actif");
                        etudiantRepository.save(etudiant);
                    }
                    break;
            }
        }

        return utilisateurRepository.save(u);
    }

    // Rejeter un utilisateur
    public Utilisateur rejeter(Long id) {
        Utilisateur u = getById(id);
        u.setStatut("REJETE");
        u.setActif(false);
        return utilisateurRepository.save(u);
    }

    // Désactiver un utilisateur
    public Utilisateur desactiver(Long id) {
        Utilisateur u = getById(id);
        u.setActif(false);
        u.setStatut("INACTIF");
        return utilisateurRepository.save(u);
    }

    // Activer un utilisateur
    public Utilisateur activer(Long id) {
        Utilisateur u = getById(id);
        u.setActif(true);
        u.setStatut("ACTIF");
        return utilisateurRepository.save(u);
    }

    // ✅ Login avec vérification BCrypt
    public Utilisateur login(String email, String motDePasse) {
        Utilisateur u = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect !"));

        if (!passwordEncoder.matches(motDePasse, u.getMotDePasse())) {
            throw new RuntimeException("Email ou mot de passe incorrect !");
        }

        return u;
    }

    // Supprimer un utilisateur
    public void deleteUtilisateur(Long id) {
        if (!utilisateurRepository.existsById(id)) {
            throw new RuntimeException("Utilisateur introuvable avec l'id : " + id);
        }
        utilisateurRepository.deleteById(id);
    }

    // Helper — capitaliser le rôle
    private String capitalizeRole(String role) {
        if (role == null) return "Enseignant";
        return switch (role.toLowerCase()) {
            case "tuteur"             -> "Tuteur";
            case "responsable"        -> "Responsable de formation";
            case "enseignant associé" -> "Enseignant associé";
            default                   -> "Enseignant";
        };
    }
}