package sn.unchk.unchk_backend.controller;

import sn.unchk.unchk_backend.entity.Annonce;
import sn.unchk.unchk_backend.repository.AnnonceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/annonces")
public class AnnonceController {

    private final AnnonceRepository repository;

    public AnnonceController(AnnonceRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Annonce> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Annonce> getById(@PathVariable Long id) {
        Annonce annonce = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Annonce introuvable"));
        return ResponseEntity.ok(annonce);
    }

    @PostMapping
    public ResponseEntity<Annonce> create(@RequestBody Annonce annonce) {
        if (annonce.getStatut() == null || annonce.getStatut().isEmpty()) {
            annonce.setStatut("Actif");
        }
        if (annonce.getIcon() == null || annonce.getIcon().isEmpty()) {
            annonce.setIcon("campaign");
        }
        return ResponseEntity.ok(repository.save(annonce));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Annonce> update(@PathVariable Long id,
                                          @RequestBody Annonce annonce) {
        Annonce existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Annonce introuvable"));
        existing.setTitre(annonce.getTitre());
        existing.setDescription(annonce.getDescription());
        existing.setType(annonce.getType());
        existing.setIcon(annonce.getIcon());
        existing.setRoleAcces(annonce.getRoleAcces());
        existing.setStatut(annonce.getStatut());
        return ResponseEntity.ok(repository.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Annonce introuvable"));
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/archiver")
    public ResponseEntity<Annonce> archiver(@PathVariable Long id) {
        Annonce existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Annonce introuvable"));
        existing.setStatut("Archivé");
        return ResponseEntity.ok(repository.save(existing));
    }

    @GetMapping("/type/{type}")
    public List<Annonce> getByType(@PathVariable String type) {
        return repository.findByType(type);
    }

    @GetMapping("/actives")
    public List<Annonce> getActives() {
        return repository.findByStatut("Actif");
    }
}