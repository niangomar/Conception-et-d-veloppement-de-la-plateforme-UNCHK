package sn.unchk.unchk_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sn.unchk.unchk_backend.entity.Formation;

import java.util.List;

@Repository
public interface FormationRepository extends JpaRepository<Formation, Long> {

    // ── FILTRES ────────────────────────────────────────
    List<Formation> findByType(String type);
    List<Formation> findByNiveau(String niveau);
    List<Formation> findByStatut(String statut);

    // ── COMPTAGE ───────────────────────────────────────
    long countByStatut(String statut);
    long countByType(String type);

    // ── TOTAL FORMÉS (SQL optimisé) ────────────────────
    @Query("SELECT COALESCE(SUM(" +
            "COALESCE(f.nombreHommes, 0) + " +
            "COALESCE(f.nombreFemmes, 0)), 0) " +
            "FROM Formation f")
    int getTotalFormes();

    // ── RECHERCHE GLOBALE ──────────────────────────────
    @Query("SELECT f FROM Formation f WHERE " +
            "LOWER(f.intitule) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(f.type)     LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(f.niveau)   LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(f.statut)   LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Formation> rechercheGlobale(@Param("search") String search);
}