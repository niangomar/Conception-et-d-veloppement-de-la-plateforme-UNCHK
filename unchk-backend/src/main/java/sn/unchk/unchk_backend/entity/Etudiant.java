package sn.unchk.unchk_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonFormat;

@Data
@Entity
@Table(name = "etudiants")
public class Etudiant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "INE")
    @JsonProperty("INE")
    private String INE;

    private String nom;
    private String prenom;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateNaissance;

    private String email;
    private String genre;
    private String niveau;
    private String formation;
    private String promo;

    private Integer anneeDebut;
    private Integer anneeSortie;

    @Column(length = 500)
    private String diplomes;

    @Column(length = 500)
    private String autresFormations;

    private String telephone;
    private String adresse;

    private String statut = "Actif";
}