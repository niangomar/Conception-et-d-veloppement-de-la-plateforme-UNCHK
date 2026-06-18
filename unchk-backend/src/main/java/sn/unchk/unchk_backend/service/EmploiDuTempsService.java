package sn.unchk.unchk_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sn.unchk.unchk_backend.entity.EmploiDuTemps;
import sn.unchk.unchk_backend.repository.EmploiDuTempsRepository;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmploiDuTempsService {

    private final EmploiDuTempsRepository repo;

    public List<EmploiDuTemps> getAll() { return repo.findAll(); }

    public List<EmploiDuTemps> getParSemaine(String semaine) {
        return repo.findBySemaine(semaine);
    }

    public List<EmploiDuTemps> getParFormationNiveauSemaine(
            String formation, String niveau, String semaine) {
        return repo.findByFormationAndNiveauAndSemaine(formation, niveau, semaine);
    }

    // ── NOUVEAU : par formateur ───────────────────────
    public List<EmploiDuTemps> getParFormateur(Long formateurId) {
        return repo.findByFormateurId(formateurId);
    }

    public List<EmploiDuTemps> getParFormateurEtSemaine(Long formateurId, String semaine) {
        return repo.findByFormateurIdAndSemaine(formateurId, semaine);
    }

    public EmploiDuTemps save(EmploiDuTemps e) { return repo.save(e); }
    public void delete(Long id) { repo.deleteById(id); }
}