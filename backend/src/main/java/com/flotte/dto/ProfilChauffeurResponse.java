package com.flotte.dto;

import java.time.LocalDate;

/**
 * DTO renvoyé au frontend avec toutes les infos du profil chauffeur.
 * Combine Utilisateur + Chauffeur en un seul objet plat.
 */
public class ProfilChauffeurResponse {

    // Infos Utilisateur
    private Long utilisateurId;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;

    // Infos Chauffeur
    private Long chauffeurId;
    private String numeroPermis;
    private String categoriePermis;
    private LocalDate dateExpirationPermis;
    private Boolean disponibilite;
    private LocalDate dateRecrutement;
    private Long regionId;
    private Boolean permisExpire; // calculé côté serveur

    // Constructeur
    public ProfilChauffeurResponse(Long utilisateurId, String nom, String prenom,
                                   String email, String telephone,
                                   Long chauffeurId, String numeroPermis,
                                   String categoriePermis, LocalDate dateExpirationPermis,
                                   Boolean disponibilite, LocalDate dateRecrutement,
                                   Long regionId) {
        this.utilisateurId = utilisateurId;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.telephone = telephone;
        this.chauffeurId = chauffeurId;
        this.numeroPermis = numeroPermis;
        this.categoriePermis = categoriePermis;
        this.dateExpirationPermis = dateExpirationPermis;
        this.disponibilite = disponibilite;
        this.dateRecrutement = dateRecrutement;
        this.regionId = regionId;
        // Alerte : permis déjà expiré ?
        this.permisExpire = dateExpirationPermis != null && dateExpirationPermis.isBefore(LocalDate.now());
    }

    // Getters
    public Long getUtilisateurId() { return utilisateurId; }
    public String getNom() { return nom; }
    public String getPrenom() { return prenom; }
    public String getEmail() { return email; }
    public String getTelephone() { return telephone; }
    public Long getChauffeurId() { return chauffeurId; }
    public String getNumeroPermis() { return numeroPermis; }
    public String getCategoriePermis() { return categoriePermis; }
    public LocalDate getDateExpirationPermis() { return dateExpirationPermis; }
    public Boolean getDisponibilite() { return disponibilite; }
    public LocalDate getDateRecrutement() { return dateRecrutement; }
    public Long getRegionId() { return regionId; }
    public Boolean getPermisExpire() { return permisExpire; }
}
