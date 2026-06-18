package sn.unchk.unchk_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import sn.unchk.unchk_backend.entity.Document;
import sn.unchk.unchk_backend.repository.DocumentRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository repository;

    @Value("${fichiers.upload-dir}")
    private String uploadDir;

    @Value("${fichiers.base-url}")
    private String baseUrl;

    public List<Document> getAll() {
        return repository.findAll();
    }

    public Document getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document introuvable avec l'id : " + id));
    }

    public Document create(Document document) {
        document.setCreatedAt(LocalDateTime.now());
        if (document.getStatut() == null || document.getStatut().isEmpty()) {
            document.setStatut("Actif");
        }
        if (document.getRoleAcces() == null || document.getRoleAcces().isEmpty()) {
            document.setRoleAcces("Tous");
        }
        return repository.save(document);
    }

    public Document update(Long id, Document updated) {
        Document existing = getById(id);
        existing.setTitre(updated.getTitre());
        existing.setType(updated.getType());
        existing.setReference(updated.getReference());
        existing.setDateDoc(updated.getDateDoc());
        existing.setDescription(updated.getDescription());
        existing.setContenu(updated.getContenu());
        existing.setRoleAcces(updated.getRoleAcces());
        existing.setStatut(updated.getStatut());
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Document introuvable avec l'id : " + id);
        }
        repository.deleteById(id);
    }

    public String uploadFichier(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        String nomFichier = file.getOriginalFilename();
        Path filePath = uploadPath.resolve(nomFichier);
        Files.copy(file.getInputStream(), filePath);
        return baseUrl + nomFichier;
    }

    public List<Document> recherche(String search) {
        return repository.rechercheGlobale(search);
    }

    public List<Document> getByType(String type) {
        return repository.findByType(type);
    }

    public List<Document> getByStatut(String statut) {
        return repository.findByStatut(statut);
    }

    public List<Document> getByRole(String role) {
        return repository.findByRole(role);
    }

    public Document archiver(Long id) {
        Document doc = getById(id);
        doc.setStatut("Archivé");
        return repository.save(doc);
    }

    public long countByType(String type) {
        return repository.countByType(type);
    }

    public long countActifs() {
        return repository.countByStatut("Actif");
    }

    public long countArchives() {
        return repository.countByStatut("Archivé");
    }
}