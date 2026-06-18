package sn.unchk.unchk_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "formateurs")
public class Formateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;

    // Type selon l'énoncé :
    // Enseignant / Enseignant associé / Responsable de formation / Tuteur
    private String type;

    private String grade;
    private String specialite;
    private String telephone;

    // ── NOUVEAUX CHAMPS ──────────────────────
    private String email;

    // Formation à laquelle il est rattaché
    private String formation;

    private String statut = "Actif";
}