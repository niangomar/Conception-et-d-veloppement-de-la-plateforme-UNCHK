package sn.unchk.unchk_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sn.unchk.unchk_backend.entity.Formation;
import sn.unchk.unchk_backend.repository.FormationRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FormationService {

    private final FormationRepository repository;

    // ── CRUD ───────────────────────────────────────────
    public List<Formation> getAll() {
        return repository.findAll();
    }

    public Formation getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Formation introuvable avec l'id : " + id));
    }

    public Formation create(Formation formation) {
        if (formation.getStatut() == null || formation.getStatut().isEmpty()) {
            formation.setStatut("Planifiée");
        }
        return repository.save(formation);
    }

    public Formation update(Long id, Formation updated) {
        Formation existing = getById(id);
        existing.setIntitule(updated.getIntitule());
        existing.setType(updated.getType());
        existing.setNiveau(updated.getNiveau());
        existing.setDateDebut(updated.getDateDebut());
        existing.setDateFin(updated.getDateFin());
        existing.setNombreHommes(updated.getNombreHommes());
        existing.setNombreFemmes(updated.getNombreFemmes());
        existing.setMontantFinancement(updated.getMontantFinancement());
        existing.setTypeFinancement(updated.getTypeFinancement());
        existing.setStatut(updated.getStatut());
        existing.setDescription(updated.getDescription());
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException(
                    "Formation introuvable avec l'id : " + id);
        }
        repository.deleteById(id);
    }

    // ── FILTRES ────────────────────────────────────────
    public List<Formation> recherche(String search) {
        return repository.rechercheGlobale(search);
    }

    public List<Formation> getByType(String type) {
        return repository.findByType(type);
    }

    public List<Formation> getByNiveau(String niveau) {
        return repository.findByNiveau(niveau);
    }

    public List<Formation> getByStatut(String statut) {
        return repository.findByStatut(statut);
    }

    // ── STATS ──────────────────────────────────────────
    public long countEnCours() {
        return repository.countByStatut("En cours");
    }

    public long countTerminees() {
        return repository.countByStatut("Terminée");
    }

    public long countPlanifiees() {
        return repository.countByStatut("Planifiée");
    }

    // ── TOTAL FORMÉS (délégué au repository) ───────────
    public int getTotalFormes() {
        return repository.getTotalFormes();
    }
}