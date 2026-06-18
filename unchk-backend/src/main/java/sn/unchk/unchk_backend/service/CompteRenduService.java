package sn.unchk.unchk_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sn.unchk.unchk_backend.entity.CompteRendu;
import sn.unchk.unchk_backend.repository.CompteRenduRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompteRenduService {

    private final CompteRenduRepository repository;

    public List<CompteRendu> getAll() {
        return repository.findAll();
    }

    public CompteRendu getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte rendu introuvable avec l'id : " + id));
    }

    public CompteRendu create(CompteRendu compteRendu) {
        compteRendu.setCreatedAt(LocalDateTime.now());
        if (compteRendu.getStatut() == null || compteRendu.getStatut().isEmpty()) {
            compteRendu.setStatut("Actif");
        }
        if (compteRendu.getRoleAcces() == null || compteRendu.getRoleAcces().isEmpty()) {
            compteRendu.setRoleAcces("Tous");
        }
        return repository.save(compteRendu);
    }

    public CompteRendu update(Long id, CompteRendu updated) {
        CompteRendu existing = getById(id);

        existing.setTitre(updated.getTitre());
        existing.setType(updated.getType());
        existing.setDateSeance(updated.getDateSeance());
        existing.setLieu(updated.getLieu());
        existing.setParticipants(updated.getParticipants());
        existing.setContenu(updated.getContenu());
        existing.setRoleAcces(updated.getRoleAcces());
        existing.setStatut(updated.getStatut());

        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Compte rendu introuvable avec l'id : " + id);
        }
        repository.deleteById(id);
    }

    public CompteRendu archiver(Long id) {
        CompteRendu c = getById(id);
        c.setStatut("Archivé");
        return repository.save(c);
    }

    public List<CompteRendu> recherche(String search) {
        return repository.rechercheGlobale(search);
    }

    public List<CompteRendu> getByType(String type) {
        return repository.findByType(type);
    }

    public List<CompteRendu> getByStatut(String statut) {
        return repository.findByStatut(statut);
    }

    public List<CompteRendu> getByRole(String role) {
        return repository.findByRole(role);
    }

    public long countActifs() {
        return repository.countByStatut("Actif");
    }

    public long countArchives() {
        return repository.countByStatut("Archivé");
    }
}