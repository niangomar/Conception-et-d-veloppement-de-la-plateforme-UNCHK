package sn.unchk.unchk_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.unchk.unchk_backend.entity.EmploiDuTemps;
import sn.unchk.unchk_backend.service.EmploiDuTempsService;
import java.util.List;

@RestController
@RequestMapping("/api/emploi-du-temps")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EmploiDuTempsController {

    private final EmploiDuTempsService service;

    @GetMapping
    public List<EmploiDuTemps> getAll() { return service.getAll(); }

    @GetMapping("/semaine/{semaine}")
    public List<EmploiDuTemps> getBySemaine(@PathVariable String semaine) {
        return service.getParSemaine(semaine);
    }

    @GetMapping("/semaine/{semaine}/formation/{formation}/niveau/{niveau}")
    public List<EmploiDuTemps> getByFormationNiveauSemaine(
            @PathVariable String semaine,
            @PathVariable String formation,
            @PathVariable String niveau) {
        return service.getParFormationNiveauSemaine(formation, niveau, semaine);
    }

    // ── NOUVEAU : endpoints formateur ────────────────

    // Tout l'EDT d'un formateur
    // GET /api/emploi-du-temps/formateur/5
    @GetMapping("/formateur/{formateurId}")
    public List<EmploiDuTemps> getByFormateur(@PathVariable Long formateurId) {
        return service.getParFormateur(formateurId);
    }

    // EDT d'un formateur pour une semaine
    // GET /api/emploi-du-temps/formateur/5/semaine/2026-W23
    @GetMapping("/formateur/{formateurId}/semaine/{semaine}")
    public List<EmploiDuTemps> getByFormateurAndSemaine(
            @PathVariable Long formateurId,
            @PathVariable String semaine) {
        return service.getParFormateurEtSemaine(formateurId, semaine);
    }

    @PostMapping
    public EmploiDuTemps create(@RequestBody EmploiDuTemps e) { return service.save(e); }

    @PutMapping("/{id}")
    public ResponseEntity<EmploiDuTemps> update(
            @PathVariable Long id, @RequestBody EmploiDuTemps e) {
        e.setId(id);
        return ResponseEntity.ok(service.save(e));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}