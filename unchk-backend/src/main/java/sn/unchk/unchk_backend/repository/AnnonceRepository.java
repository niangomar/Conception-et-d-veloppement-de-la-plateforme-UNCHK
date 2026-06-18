package sn.unchk.unchk_backend.repository;

import sn.unchk.unchk_backend.entity.Annonce;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnnonceRepository extends JpaRepository<Annonce, Long> {
    List<Annonce> findByType(String type);
    List<Annonce> findByStatut(String statut);
}