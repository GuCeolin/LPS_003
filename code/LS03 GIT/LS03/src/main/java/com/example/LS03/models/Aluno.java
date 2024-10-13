package com.example.LS03.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Aluno extends Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cpf;
    private String rg;
    private String endereco;
    private String curso;
    private int saldoMoedas;

    // Getters e Setters

    public void receberMoedas(int quantidade, String motivo) {
        // lógica para adicionar moedas ao saldo
    }

    public boolean trocarMoedas(Vantagem vantagem) {
        // lógica para trocar moedas por vantagem
        return true;
    }
}