package com.flotte.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Entité Chauffeur — correspond à la table `chauffeurs`.
 * Liée à Utilisateur par une relation OneToOne (utilisateur_id).
 */
@Entity
@Table(name = "chauffeurs")
public class Chauffeur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "utilisateur_id", nullable = false, unique = true)
    private Utilisateur utilisateur;

    @Column(name = "region_id", nullable = false)
    private Long regionId;

    @Column(name = "numero_permis", nullable = false, unique = true, length = 50)
    private String numeroPermis;

    @Column(name = "categorie_permis", nullable = false, length = 50)
    private String categoriePermis;

    @Column(name = "date_expiration_permis", nullable = false)
    private LocalDate dateExpirationPermis;

    @Column(nullable = false)
    private Boolean disponibilite = true;

    @Column(name = "date_recrutement")
    private LocalDate dateRecrutement;

    // ---- Getters & Setters ----
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Utilisateur getUtilisateur() { return utilisateur; }
    public void setUtilisateur(Utilisateur utilisateur) { this.utilisateur = utilisateur; }

    public Long getRegionId() { return regionId; }
    public void setRegionId(Long regionId) { this.regionId = regionId; }

    public String getNumeroPermis() { return numeroPermis; }
    public void setNumeroPermis(String numeroPermis) { this.numeroPermis = numeroPermis; }

    public String getCategoriePermis() { return categoriePermis; }
    public void setCategoriePermis(String categoriePermis) { this.categoriePermis = categoriePermis; }

    public LocalDate getDateExpirationPermis() { return dateExpirationPermis; }
    public void setDateExpirationPermis(LocalDate dateExpirationPermis) {
        this.dateExpirationPermis = dateExpirationPermis;
    }

    public Boolean getDisponibilite() { return disponibilite; }
    public void setDisponibilite(Boolean disponibilite) { this.disponibilite = disponibilite; }

    public LocalDate getDateRecrutement() { return dateRecrutement; }
    public void setDateRecrutement(LocalDate dateRecrutement) { this.dateRecrutement = dateRecrutement; }
}
