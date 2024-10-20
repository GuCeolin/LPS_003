package com.example.LS03.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.LS03.models.Vantagem;
@Repository
public interface VantagemRepository extends JpaRepository<Vantagem, Long> {
    // Custom queries se necessário
}