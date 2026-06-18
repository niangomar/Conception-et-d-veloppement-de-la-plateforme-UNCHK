package sn.unchk.unchk_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sn.unchk.unchk_backend.entity.Document;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByType(String type);

    List<Document> findByStatut(String statut);

    List<Document> findByRoleAcces(String roleAcces);

    List<Document> findByTypeAndStatut(String type, String statut);

    long countByType(String type);

    long countByStatut(String statut);

    @Query("SELECT DISTINCT d FROM Document d WHERE " +
            "LOWER(d.titre) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(d.type) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(d.reference) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(d.description) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Document> rechercheGlobale(@Param("search") String search);

    @Query("SELECT DISTINCT d FROM Document d WHERE " +
            "d.roleAcces = 'Tous' OR d.roleAcces = :role")
    List<Document> findByRole(@Param("role") String role);
}