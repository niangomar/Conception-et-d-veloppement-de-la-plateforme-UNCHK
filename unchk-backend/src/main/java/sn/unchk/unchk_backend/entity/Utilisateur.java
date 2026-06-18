package sn.unchk.unchk_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "utilisateurs")
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String email;

    @Column(name = "mot_de_passe")
    private String motDePasse;

    private String role;

    private Boolean actif = false;

    @Column(name = "statut")
    private String statut = "EN_ATTENTE"; // EN_ATTENTE, ACTIF, REJETE

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}