package sn.unchk.unchk_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sn.unchk.unchk_backend.entity.Etudiant;

import java.util.List;
import java.util.Optional;

@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {

    // Recherche par INE
    Optional<Etudiant> findByINE(String INE);

    // ✅ AJOUTE CETTE LIGNE
    Optional<Etudiant> findByEmail(String email);

    // Recherche par nom ou prénom
    List<Etudiant> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom);

    // Filtrer par formation
    List<Etudiant> findByFormation(String formation);

    // Filtrer par statut
    List<Etudiant> findByStatut(String statut);

    // Filtrer par promo
    List<Etudiant> findByPromo(String promo);

    // Compter les actifs
    long countByStatut(String statut);

    // Compter par formation
    long countByFormation(String formation);

    // Recherche globale
    @Query("SELECT e FROM Etudiant e WHERE " +
            "LOWER(e.nom) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(e.prenom) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(e.INE) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(e.formation) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Etudiant> rechercheGlobale(@Param("search") String search);

    boolean existsByEmail(String email);
}