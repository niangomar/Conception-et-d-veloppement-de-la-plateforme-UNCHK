package sn.unchk.unchk_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.unchk.unchk_backend.entity.Utilisateur;
import sn.unchk.unchk_backend.service.UtilisateurService;
import java.util.List;
// Ajoute ces imports en haut
import sn.unchk.unchk_backend.repository.UtilisateurRepository;
import org.springframework.security.crypto.password.PasswordEncoder;


@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    record LoginRequest(String email, String motDePasse) {}

    @GetMapping
    public ResponseEntity<List<Utilisateur>> getAll() {
        return ResponseEntity.ok(utilisateurService.getAllUtilisateurs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(utilisateurService.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/en-attente")
    public ResponseEntity<List<Utilisateur>> getEnAttente() {
        return ResponseEntity.ok(utilisateurService.getEnAttente());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Utilisateur utilisateur) {
        try {
            return ResponseEntity.ok(utilisateurService.createUtilisateur(utilisateur));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    // ✅ ENDPOINT INSCRIPTION
    @PostMapping("/inscription")
    public ResponseEntity<?> inscription(@RequestBody Utilisateur utilisateur) {
        try {
            return ResponseEntity.ok(utilisateurService.createUtilisateur(utilisateur));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ ENDPOINT LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Utilisateur user = utilisateurService.login(request.email(), request.motDePasse());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }



    @PutMapping("/{id}/approuver")
    public ResponseEntity<?> approuver(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(utilisateurService.approuver(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/rejeter")
    public ResponseEntity<?> rejeter(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(utilisateurService.rejeter(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/desactiver")
    public ResponseEntity<?> desactiver(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(utilisateurService.desactiver(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/activer")
    public ResponseEntity<?> activer(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(utilisateurService.activer(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        utilisateurService.deleteUtilisateur(id);
        return ResponseEntity.ok().build();
    }
}