package sn.unchk.unchk_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.unchk.unchk_backend.entity.Formation;
import sn.unchk.unchk_backend.service.FormationService;

import java.util.List;

@RestController
@RequestMapping("/api/formations")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class FormationController {

    private final FormationService service;

    @GetMapping
    public ResponseEntity<List<Formation>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Formation> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Formation>> search(@RequestParam String q) {
        return ResponseEntity.ok(service.recherche(q));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Formation>> getByType(@PathVariable String type) {
        return ResponseEntity.ok(service.getByType(type));
    }

    @GetMapping("/niveau/{niveau}")
    public ResponseEntity<List<Formation>> getByNiveau(@PathVariable String niveau) {
        return ResponseEntity.ok(service.getByNiveau(niveau));
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Formation>> getByStatut(@PathVariable String statut) {
        return ResponseEntity.ok(service.getByStatut(statut));
    }

    // ── STATS DYNAMIQUES ───────────────────────────────
    @GetMapping("/stats/en-cours")
    public ResponseEntity<Long> countEnCours() {
        return ResponseEntity.ok(service.countEnCours());
    }

    @GetMapping("/stats/terminees")
    public ResponseEntity<Long> countTerminees() {
        return ResponseEntity.ok(service.countTerminees());
    }

    @GetMapping("/stats/planifiees")
    public ResponseEntity<Long> countPlanifiees() {
        return ResponseEntity.ok(service.countPlanifiees());
    }

    @GetMapping("/stats/total-formes")
    public ResponseEntity<Integer> getTotalFormes() {
        return ResponseEntity.ok(service.getTotalFormes());
    }

    @PostMapping
    public ResponseEntity<Formation> create(@RequestBody Formation formation) {
        return ResponseEntity.ok(service.create(formation));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Formation> update(
            @PathVariable Long id,
            @RequestBody Formation formation) {
        return ResponseEntity.ok(service.update(id, formation));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Formation supprimée avec succès");
    }
}