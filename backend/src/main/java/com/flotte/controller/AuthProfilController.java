package com.flotte.controller;

import com.flotte.dto.*;
import com.flotte.service.AuthProfilService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Contrôleur REST — Login + Profil Chauffeur
 *
 * Routes :
 *   POST /api/auth/login                      → connexion
 *   GET  /api/chauffeur/profil/{utilisateurId} → consulter profil
 *   PUT  /api/chauffeur/profil/{utilisateurId} → modifier profil
 */
@RestController
@CrossOrigin(origins = "http://localhost:5173") // Vite (React)
public class AuthProfilController {

    private final AuthProfilService service;

    public AuthProfilController(AuthProfilService service) {
        this.service = service;
    }

    // ---- 1. LOGIN ----
    @PostMapping("/api/auth/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        LoginResponse resp = service.login(req);
        return ResponseEntity.ok(resp);
    }

    // ---- 2. CONSULTER PROFIL CHAUFFEUR ----
    @GetMapping("/api/chauffeur/profil/{utilisateurId}")
    public ResponseEntity<ProfilChauffeurResponse> getProfil(@PathVariable Long utilisateurId) {
        ProfilChauffeurResponse resp = service.getProfil(utilisateurId);
        return ResponseEntity.ok(resp);
    }

    // ---- 3. MODIFIER PROFIL CHAUFFEUR ----
    @PutMapping("/api/chauffeur/profil/{utilisateurId}")
    public ResponseEntity<ProfilChauffeurResponse> updateProfil(
            @PathVariable Long utilisateurId,
            @RequestBody ProfilUpdateRequest req) {
        ProfilChauffeurResponse resp = service.updateProfil(utilisateurId, req);
        return ResponseEntity.ok(resp);
    }
}
