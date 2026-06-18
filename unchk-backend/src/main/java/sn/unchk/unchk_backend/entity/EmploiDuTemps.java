package sn.unchk.unchk_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "emploi_du_temps")
public class EmploiDuTemps {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String jour;
    private String heure;
    private String cours;
    private String salle;
    private String color;
    private String formation;
    private String niveau;
    private String semaine; // ex: "2026-W23"

    // ── NOUVEAU : lien vers le formateur ──────────────
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "formateur_id")
    private Formateur formateur;
}