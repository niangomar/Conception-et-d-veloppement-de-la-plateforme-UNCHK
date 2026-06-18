package sn.unchk.unchk_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sn.unchk.unchk_backend.entity.Etudiant;
import sn.unchk.unchk_backend.repository.EtudiantRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EtudiantService {

    private final EtudiantRepository repository;

    public List<Etudiant> getAll() {
        return repository.findAll();
    }

    public Etudiant getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Étudiant introuvable avec l'id : " + id));
    }

    public Etudiant getByINE(String INE) {
        return repository.findByINE(INE)
                .orElseThrow(() -> new RuntimeException("Étudiant introuvable avec l'INE : " + INE));
    }

    // ✅ NOUVEAU — Récupérer par email
    public Etudiant getByEmail(String email) {
        return repository.findByEmail(email).orElse(null);
    }

    public Etudiant create(Etudiant etudiant) {
        // Vérifie INE seulement s'il est renseigné
        if (etudiant.getINE() != null && !etudiant.getINE().isEmpty()) {
            if (repository.findByINE(etudiant.getINE()).isPresent()) {
                throw new RuntimeException("Cet INE existe déjà !");
            }
        }
        if (etudiant.getStatut() == null || etudiant.getStatut().isEmpty()) {
            etudiant.setStatut("Actif");
        }
        return repository.save(etudiant);
    }

    public Etudiant update(Long id, Etudiant updated) {
        Etudiant existing = getById(id);

        existing.setNom(updated.getNom());
        existing.setPrenom(updated.getPrenom());
        existing.setDateNaissance(updated.getDateNaissance());
        existing.setEmail(updated.getEmail());
        existing.setGenre(updated.getGenre());
        existing.setNiveau(updated.getNiveau());         // ✅ manquait
        existing.setINE(updated.getINE());               // ✅ manquait
        existing.setFormation(updated.getFormation());
        existing.setPromo(updated.getPromo());
        existing.setAnneeDebut(updated.getAnneeDebut());
        existing.setAnneeSortie(updated.getAnneeSortie());
        existing.setDiplomes(updated.getDiplomes());
        existing.setAutresFormations(updated.getAutresFormations());
        existing.setTelephone(updated.getTelephone());
        existing.setAdresse(updated.getAdresse());
        existing.setStatut(updated.getStatut());

        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Étudiant introuvable avec l'id : " + id);
        }
        repository.deleteById(id);
    }

    public List<Etudiant> recherche(String search) {
        return repository.rechercheGlobale(search);
    }

    public List<Etudiant> getByFormation(String formation) {
        return repository.findByFormation(formation);
    }

    public List<Etudiant> getByStatut(String statut) {
        return repository.findByStatut(statut);
    }

    public long countActifs() {
        return repository.countByStatut("Actif");
    }

    public long countByFormation(String formation) {
        return repository.countByFormation(formation);
    }
}