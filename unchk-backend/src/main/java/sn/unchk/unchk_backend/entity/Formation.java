package sn.unchk.unchk_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "formations")
public class Formation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String intitule;

    // ex: Licence, Master, Certification, Formation privée
    private String type;

    // ex: L1, L2, L3, M1, M2
    private String niveau;

    private LocalDate dateDebut;
    private LocalDate dateFin;

    // Nombre de formés
    private Integer nombreHommes;
    private Integer nombreFemmes;

    // Financement
    private Double montantFinancement;

    // ex: Public, Privé, Certification
    private String typeFinancement;

    // ex: En cours, Terminée, Planifiée
    private String statut;

    private String description;
}