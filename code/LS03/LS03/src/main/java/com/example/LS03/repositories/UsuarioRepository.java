package com.example.LS03.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.LS03.models.Usuario;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
}