package com.flotte.service;

import com.flotte.dto.*;
import com.flotte.entity.Chauffeur;
import com.flotte.entity.Utilisateur;
import com.flotte.repository.ChauffeurRepository;
import com.flotte.repository.UtilisateurRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;

/**
 * Service Auth & Profil Chauffeur.
 * Contient toute la logique métier (règles, validations).
 */
@Service
public class AuthProfilService {

    private final UtilisateurRepository utilisateurRepo;
    private final ChauffeurRepository chauffeurRepo;
    private final PasswordEncoder passwordEncoder;

    public AuthProfilService(UtilisateurRepository utilisateurRepo,
                             ChauffeurRepository chauffeurRepo,
                             PasswordEncoder passwordEncoder) {
        this.utilisateurRepo = utilisateurRepo;
        this.chauffeurRepo = chauffeurRepo;
        this.passwordEncoder = passwordEncoder;
    }

    // ================================================================
    // 1. LOGIN
    // ================================================================
    public LoginResponse login(LoginRequest req) {
        // Validation champs vides
        if (req.getEmail() == null || req.getEmail().isBlank()
                || req.getMotDePasse() == null || req.getMotDePasse().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email et mot de passe requis");
        }

        // Chercher l'utilisateur par email
        Utilisateur user = utilisateurRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Email ou mot de passe incorrect"));

        // Vérifier le mot de passe avec BCrypt
        if (!passwordEncoder.matches(req.getMotDePasse(), user.getMotDePasse())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou mot de passe incorrect");
        }

        return new LoginResponse(
                user.getId(),
                user.getNom(),
                user.getPrenom(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    // ================================================================
    // 2. CONSULTER PROFIL CHAUFFEUR
    // ================================================================
    public ProfilChauffeurResponse getProfil(Long utilisateurId) {
        Chauffeur c = chauffeurRepo.findByUtilisateurId(utilisateurId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Profil chauffeur introuvable"));

        return toProfilResponse(c);
    }

    // ================================================================
    // 3. MODIFIER PROFIL CHAUFFEUR
    // ================================================================
    @Transactional
    public ProfilChauffeurResponse updateProfil(Long utilisateurId, ProfilUpdateRequest req) {
        Chauffeur c = chauffeurRepo.findByUtilisateurId(utilisateurId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Profil chauffeur introuvable"));

        Utilisateur u = c.getUtilisateur();

        // --- Mise à jour email ---
        if (req.getEmail() != null && !req.getEmail().isBlank()) {
            // Vérifier unicité si email change
            if (!req.getEmail().equals(u.getEmail())) {
                if (utilisateurRepo.existsByEmailAndIdNot(req.getEmail(), u.getId())) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Cet email est déjà utilisé");
                }
                u.setEmail(req.getEmail());
            }
        }

        // --- Mise à jour téléphone ---
        if (req.getTelephone() != null && !req.getTelephone().isBlank()) {
            u.setTelephone(req.getTelephone());
        }

        // --- Mise à jour catégorie permis ---
        if (req.getCategoriePermis() != null && !req.getCategoriePermis().isBlank()) {
            c.setCategoriePermis(req.getCategoriePermis());
        }

        // --- Mise à jour date expiration permis ---
        if (req.getDateExpirationPermis() != null) {
            if (req.getDateExpirationPermis().isBefore(LocalDate.now())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "La date d'expiration du permis ne peut pas être dans le passé");
            }
            c.setDateExpirationPermis(req.getDateExpirationPermis());
        }

        utilisateurRepo.save(u);
        chauffeurRepo.save(c);

        return toProfilResponse(c);
    }

    // ================================================================
    // Méthode utilitaire : convertir Chauffeur → DTO réponse
    // ================================================================
    private ProfilChauffeurResponse toProfilResponse(Chauffeur c) {
        Utilisateur u = c.getUtilisateur();
        return new ProfilChauffeurResponse(
                u.getId(), u.getNom(), u.getPrenom(),
                u.getEmail(), u.getTelephone(),
                c.getId(), c.getNumeroPermis(),
                c.getCategoriePermis(), c.getDateExpirationPermis(),
                c.getDisponibilite(), c.getDateRecrutement(),
                c.getRegionId()
        );
    }
}
