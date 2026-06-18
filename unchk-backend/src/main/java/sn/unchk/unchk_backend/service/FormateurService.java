package sn.unchk.unchk_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sn.unchk.unchk_backend.entity.Formateur;
import sn.unchk.unchk_backend.repository.FormateurRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FormateurService {

    private final FormateurRepository repository;

    // Récupérer tous les formateurs
    public List<Formateur> getAll() {
        return repository.findAll();
    }

    // Récupérer par ID
    public Formateur getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formateur introuvable avec l'id : " + id));
    }

    // Récupérer par email (utilisé par mon-profil)
    public Optional<Formateur> getByEmail(String email) {
        return repository.findByEmail(email);
    }

    // Créer un formateur
    public Formateur create(Formateur formateur) {
        if (formateur.getStatut() == null || formateur.getStatut().isEmpty()) {
            formateur.setStatut("Actif");
        }
        return repository.save(formateur);
    }

    // Modifier un formateur
    public Formateur update(Long id, Formateur updated) {
        Formateur existing = getById(id);

        existing.setNom(updated.getNom());
        existing.setPrenom(updated.getPrenom());
        existing.setType(updated.getType());
        existing.setGrade(updated.getGrade());
        existing.setSpecialite(updated.getSpecialite());
        existing.setTelephone(updated.getTelephone());
        existing.setEmail(updated.getEmail());
        existing.setFormation(updated.getFormation());
        existing.setStatut(updated.getStatut());

        return repository.save(existing);
    }

    // Supprimer un formateur
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Formateur introuvable avec l'id : " + id);
        }
        repository.deleteById(id);
    }

    // Recherche globale
    public List<Formateur> recherche(String search) {
        return repository.rechercheGlobale(search);
    }

    // Filtrer par type
    public List<Formateur> getByType(String type) {
        return repository.findByType(type);
    }

    // Filtrer par formation
    public List<Formateur> getByFormation(String formation) {
        return repository.findByFormation(formation);
    }

    // Filtrer par statut
    public List<Formateur> getByStatut(String statut) {
        return repository.findByStatut(statut);
    }

    // Stats
    public long countActifs() {
        return repository.countByStatut("Actif");
    }

    public long countByType(String type) {
        return repository.countByType(type);
    }
}