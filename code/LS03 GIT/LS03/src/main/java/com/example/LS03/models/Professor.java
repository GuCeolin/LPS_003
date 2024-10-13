package com.example.LS03.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Professor extends Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String cpf;
    private String departamento;
    private int saldoMoedas;
    
    // Getters e Setters
    
    public boolean distribuirMoedas(Aluno aluno, int quantidade, String motivo) {
        // lógica para distribuir moedas
        return true;
    }
}