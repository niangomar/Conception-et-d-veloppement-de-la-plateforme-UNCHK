package sn.unchk.unchk_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "document")
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    private String type;

    private String reference;

    @Column(name = "date_doc")
    private LocalDate dateDoc;

    @Column(length = 1000)
    private String description;

    @Column(length = 2000)
    private String contenu;

    @Column(name = "fichier_url")
    private String fichierUrl;

    @Column(name = "role_acces")
    private String roleAcces = "Tous";

    private String statut = "Actif";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "auteur_id")
    @JsonIgnoreProperties({"motDePasse", "hibernateLazyInitializer", "handler"})
    private Utilisateur auteur;
}