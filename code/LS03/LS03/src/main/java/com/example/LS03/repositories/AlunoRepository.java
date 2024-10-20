package com.example.LS03.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.LS03.models.Aluno;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    // Custom queries se necessário
}