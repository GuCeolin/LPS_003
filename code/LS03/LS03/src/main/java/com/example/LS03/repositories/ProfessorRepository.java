package com.example.LS03.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.LS03.models.Professor;
@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    // Custom queries se necessário
}