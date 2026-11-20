package com.flotte.repository;

import com.flotte.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    // Chercher par email pour le login
    Optional<Utilisateur> findByEmail(String email);

    // Vérifier unicité email (utile lors de modification du profil)
    boolean existsByEmailAndIdNot(String email, Long id);
}
