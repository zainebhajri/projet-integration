package com.flotte.dto;

import java.time.LocalDate;

/**
 * DTO reçu du frontend pour mettre à jour le profil chauffeur.
 * Seuls les champs modifiables sont inclus.
 */
public class ProfilUpdateRequest {
    // Champs Utilisateur modifiables
    private String telephone;
    private String email;

    // Champs Chauffeur modifiables
    private String categoriePermis;
    private LocalDate dateExpirationPermis;

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCategoriePermis() { return categoriePermis; }
    public void setCategoriePermis(String categoriePermis) { this.categoriePermis = categoriePermis; }

    public LocalDate getDateExpirationPermis() { return dateExpirationPermis; }
    public void setDateExpirationPermis(LocalDate dateExpirationPermis) {
        this.dateExpirationPermis = dateExpirationPermis;
    }
}
