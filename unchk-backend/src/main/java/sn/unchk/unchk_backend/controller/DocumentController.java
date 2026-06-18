package sn.unchk.unchk_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sn.unchk.unchk_backend.entity.Document;
import sn.unchk.unchk_backend.service.DocumentService;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService service;

    @Value("${fichiers.upload-dir}")
    private String uploadDir;

    @GetMapping
    public ResponseEntity<List<Document>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Document>> search(@RequestParam String q) {
        return ResponseEntity.ok(service.recherche(q));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Document>> getByType(@PathVariable String type) {
        return ResponseEntity.ok(service.getByType(type));
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Document>> getByStatut(@PathVariable String statut) {
        return ResponseEntity.ok(service.getByStatut(statut));
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<Document>> getByRole(@PathVariable String role) {
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
    public ResponseEntity<Document> create(@RequestBody Document document) {
        return ResponseEntity.ok(service.create(document));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Document> update(
            @PathVariable Long id,
            @RequestBody Document document) {
        return ResponseEntity.ok(service.update(id, document));
    }

    @PutMapping("/{id}/archiver")
    public ResponseEntity<Document> archiver(@PathVariable Long id) {
        return ResponseEntity.ok(service.archiver(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Document supprimé avec succès");
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFichier(
            @RequestParam("file") MultipartFile file) {
        try {
            String url = service.uploadFichier(file);
            return ResponseEntity.ok(url);
        } catch (IOException e) {
            return ResponseEntity.badRequest()
                    .body("Erreur lors de l'upload : " + e.getMessage());
        }
    }

    @GetMapping("/fichier/{filename:.+}")
    public ResponseEntity<Resource> serveFichier(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = filename.endsWith(".pdf")
                    ? "application/pdf"
                    : "application/octet-stream";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + filename + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}