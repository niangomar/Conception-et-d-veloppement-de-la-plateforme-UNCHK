package sn.unchk.unchk_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sn.unchk.unchk_backend.entity.Utilisateur;
import java.util.List;
import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByEmail (String email);

    List<Utilisateur> findByRole(String role);
    List<Utilisateur> findByRoleIn(List<String> roles);
    boolean existsByEmail(String email);
    List<Utilisateur> findByStatut(String statut); // ← nouveau
}