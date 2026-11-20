package com.flotte.controller;


import com.flotte.repository.UtilisateurRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Configuration Security + Bean BCryptPasswordEncoder.
 *
 * Cette classe :
 * 1. Déclare le PasswordEncoder (BCrypt) utilisé partout dans l'appli.
 * 2. Désactive le formulaire de login Spring Security par défaut
 *    (on gère l'auth via notre propre endpoint /api/auth/login).
 * 3. Fournit un CommandLineRunner qui hash les mots de passe de test
 *    au démarrage (exécuté seulement si le mot_de_passe n'est pas
 *    encore un hash BCrypt).
 */
@Configuration
public class SecurityConfig {

    // ---- Bean BCrypt ----
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    }

    // ---- Désactiver Spring Security par défaut (toutes routes accessibles) ----
    @Bean
    public org.springframework.security.web.SecurityFilterChain filterChain(
            org.springframework.security.config.annotation.web.builders.HttpSecurity http)
            throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }

    /**
     * HashInitializer : au démarrage, si le mot_de_passe des utilisateurs
     * de test contient "HASH_BCRYPT" (non encore hashé), on le remplace
     * par un vrai hash BCrypt pour le mot de passe "test1234".
     *
     * À SUPPRIMER en production — sert uniquement pour le développement.
     */
    @Bean
    @Profile("!prod")
    public CommandLineRunner hashInitializer(UtilisateurRepository repo, PasswordEncoder encoder) {
        return args -> {
            repo.findAll().forEach(u -> {
                if (u.getMotDePasse().startsWith("HASH_BCRYPT")) {
                    u.setMotDePasse(encoder.encode("test1234"));
                    repo.save(u);
                    System.out.println("[INIT] Mot de passe hashé pour : " + u.getEmail());
                }
            });
        };
    }
}
