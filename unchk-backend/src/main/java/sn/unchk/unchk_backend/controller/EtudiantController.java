package sn.unchk.unchk_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.unchk.unchk_backend.entity.Etudiant;
import sn.unchk.unchk_backend.service.EtudiantService;

import java.util.List;

@RestController
@RequestMapping("/api/etudiants")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class EtudiantController {

    private final EtudiantService service;

    @GetMapping
    public ResponseEntity<List<Etudiant>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Etudiant> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/ine/{INE}")
    public ResponseEntity<Etudiant> getByINE(@PathVariable String INE) {
        return ResponseEntity.ok(service.getByINE(INE));
    }

    // ✅ NOUVEAU — GET par email
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getByEmail(@PathVariable String email) {
        Etudiant etudiant = service.getByEmail(email);
        if (etudiant == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(etudiant);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Etudiant>> search(@RequestParam String q) {
        return ResponseEntity.ok(service.recherche(q));
    }

    @GetMapping("/formation/{formation}")
    public ResponseEntity<List<Etudiant>> getByFormation(@PathVariable String formation) {
        return ResponseEntity.ok(service.getByFormation(formation));
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Etudiant>> getByStatut(@PathVariable String statut) {
        return ResponseEntity.ok(service.getByStatut(statut));
    }

    @GetMapping("/stats/actifs")
    public ResponseEntity<Long> countActifs() {
        return ResponseEntity.ok(service.countActifs());
    }

    @PostMapping
    public ResponseEntity<Etudiant> create(@RequestBody Etudiant etudiant) {
        return ResponseEntity.ok(service.create(etudiant));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Etudiant> update(
            @PathVariable Long id,
            @RequestBody Etudiant etudiant) {
        return ResponseEntity.ok(service.update(id, etudiant));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Étudiant supprimé avec succès");
    }
}