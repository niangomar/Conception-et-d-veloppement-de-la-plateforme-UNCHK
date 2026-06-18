package sn.unchk.unchk_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.unchk.unchk_backend.entity.CompteRendu;
import sn.unchk.unchk_backend.service.CompteRenduService;

import java.util.List;

@RestController
@RequestMapping("/api/comptes-rendus")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class CompteRenduController {

    private final CompteRenduService service;

    @GetMapping
    public ResponseEntity<List<CompteRendu>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompteRendu> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<CompteRendu>> search(@RequestParam String q) {
        return ResponseEntity.ok(service.recherche(q));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<CompteRendu>> getByType(@PathVariable String type) {
        return ResponseEntity.ok(service.getByType(type));
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<CompteRendu>> getByStatut(@PathVariable String statut) {
        return ResponseEntity.ok(service.getByStatut(statut));
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<CompteRendu>> getByRole(@PathVariable String role) {
        return ResponseEntity.ok(service.getByRole(role));
    }

    @GetMapping("/stats/actifs")
    public ResponseEntity<Long> countActifs() {
        return ResponseEntity.ok(service.countActifs());
    }

    @GetMapping("/stats/archives")
    public ResponseEntity<Long> countArchives() {
        return ResponseEntity.ok(service.countArchives());
    }

    @PostMapping
    public ResponseEntity<CompteRendu> create(@RequestBody CompteRendu compteRendu) {
        return ResponseEntity.ok(service.create(compteRendu));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompteRendu> update(
            @PathVariable Long id,
            @RequestBody CompteRendu compteRendu) {
        return ResponseEntity.ok(service.update(id, compteRendu));
    }

    @PutMapping("/{id}/archiver")
    public ResponseEntity<CompteRendu> archiver(@PathVariable Long id) {
        return ResponseEntity.ok(service.archiver(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Compte rendu supprimé avec succès");
    }
}