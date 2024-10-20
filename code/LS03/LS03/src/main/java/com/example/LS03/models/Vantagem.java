package com.example.LS03.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Vantagem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    private String descricao;
    private String foto;
    private int custoMoedas;
    
    // Getters e Setters
    
    public boolean resgatar(Aluno aluno) {
        // lógica para resgate de vantagem
        return true;
    }
}