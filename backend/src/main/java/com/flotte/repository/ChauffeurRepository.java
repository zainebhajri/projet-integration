package com.flotte.repository;

import com.flotte.entity.Chauffeur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ChauffeurRepository extends JpaRepository<Chauffeur, Long> {

    // Trouver le profil chauffeur via l'id de l'utilisateur connecté
    Optional<Chauffeur> findByUtilisateurId(Long utilisateurId);

    // Vérifier unicité du numéro de permis (utile si le chauffeur modifie son profil)
    boolean existsByNumeroPermisAndIdNot(String numeroPermis, Long id);
}
