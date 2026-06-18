package sn.unchk.unchk_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.unchk.unchk_backend.entity.Formateur;
import sn.unchk.unchk_backend.service.FormateurService;

import java.util.List;

@RestController
@RequestMapping("/api/formateurs")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class FormateurController {

    private final FormateurService service;

    // GET tous les formateurs
    @GetMapping
    public ResponseEntity<List<Formateur>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // GET par ID
    @GetMapping("/{id}")
    public ResponseEntity<Formateur> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    // GET par email (utilisé par mon-profil)
    // ex: /api/formateurs/email/formateur@unchk.sn
    @GetMapping("/email/{email}")
    public ResponseEntity<Formateur> getByEmail(@PathVariable String email) {
        return service.getByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET recherche globale
    // ex: /api/formateurs/search?q=cheikh
    @GetMapping("/search")
    public ResponseEntity<List<Formateur>> search(@RequestParam String q) {
        return ResponseEntity.ok(service.recherche(q));
    }

    // GET filtrer par type
    // ex: /api/formateurs/type/Tuteur
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Formateur>> getByType(@PathVariable String type) {
        return ResponseEntity.ok(service.getByType(type));
    }

    // GET filtrer par formation
    // ex: /api/formateurs/formation/Informatique
    @GetMapping("/formation/{formation}")
    public ResponseEntity<List<Formateur>> getByFormation(@PathVariable String formation) {
        return ResponseEntity.ok(service.getByFormation(formation));
    }

    // GET filtrer par statut
    // ex: /api/formateurs/statut/Actif
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Formateur>> getByStatut(@PathVariable String statut) {
        return ResponseEntity.ok(service.getByStatut(statut));
    }

    // GET stats actifs
    @GetMapping("/stats/actifs")
    public ResponseEntity<Long> countActifs() {
        return ResponseEntity.ok(service.countActifs());
    }

    // POST créer un formateur
    @PostMapping
    public ResponseEntity<Formateur> create(@RequestBody Formateur formateur) {
        return ResponseEntity.ok(service.create(formateur));
    }

    // PUT modifier un formateur
    @PutMapping("/{id}")
    public ResponseEntity<Formateur> update(
            @PathVariable Long id,
            @RequestBody Formateur formateur) {
        return ResponseEntity.ok(service.update(id, formateur));
    }

    // DELETE supprimer un formateur
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Formateur supprimé avec succès");
    }
}