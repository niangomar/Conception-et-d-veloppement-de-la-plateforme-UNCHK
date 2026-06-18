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
@Table(name = "comptes_rendus")
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class CompteRendu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    // Réunion / Rencontre / Séminaire / Webinaire / Conseil d'Université
    private String type;

    @Column(name = "date_seance")
    private LocalDate dateSeance;

    private String lieu;

    @Column(length = 1000)
    private String participants;

    @Column(length = 4000)
    private String contenu;

    // Qui peut consulter ce compte rendu
    @Column(name = "role_acces")
    private String roleAcces = "Tous";

    // Actif / Archivé
    private String statut = "Actif";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "auteur_id")
    @JsonIgnoreProperties({"motDePasse", "hibernateLazyInitializer", "handler"})
    private Utilisateur auteur;
}