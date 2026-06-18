package sn.unchk.unchk_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sn.unchk.unchk_backend.entity.CompteRendu;

import java.util.List;

@Repository
public interface CompteRenduRepository extends JpaRepository<CompteRendu, Long> {

    List<CompteRendu> findByType(String type);

    List<CompteRendu> findByStatut(String statut);

    long countByStatut(String statut);

    long countByType(String type);

    @Query("SELECT DISTINCT c FROM CompteRendu c WHERE " +
            "LOWER(c.titre) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(c.type) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(c.lieu) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(c.contenu) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<CompteRendu> rechercheGlobale(@Param("search") String search);

    // Comptes rendus accessibles par rôle
    @Query("SELECT DISTINCT c FROM CompteRendu c WHERE " +
            "c.roleAcces = 'Tous' OR c.roleAcces = :role")
    List<CompteRendu> findByRole(@Param("role") String role);
}