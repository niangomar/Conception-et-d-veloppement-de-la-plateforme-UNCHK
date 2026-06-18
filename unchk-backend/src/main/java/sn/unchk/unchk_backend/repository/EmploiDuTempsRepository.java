package sn.unchk.unchk_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sn.unchk.unchk_backend.entity.EmploiDuTemps;
import java.util.List;

public interface EmploiDuTempsRepository extends JpaRepository<EmploiDuTemps, Long> {

    List<EmploiDuTemps> findBySemaine(String semaine);

    List<EmploiDuTemps> findByFormationAndNiveauAndSemaine(
            String formation, String niveau, String semaine);

    // ── NOUVEAU : filtres par formateur ──────────────
    List<EmploiDuTemps> findByFormateurId(Long formateurId);

    List<EmploiDuTemps> findByFormateurIdAndSemaine(Long formateurId, String semaine);
}