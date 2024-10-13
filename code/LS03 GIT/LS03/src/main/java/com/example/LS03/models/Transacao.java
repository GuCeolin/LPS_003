package com.example.LS03.models;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Transacao {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Date data;
    private int quantidade;
    private String tipo; // Pode ser "Envio" ou "Recebimento"
    private String motivo;
    
    @ManyToOne
    private Aluno aluno;
    
    @ManyToOne
    private Professor professor;
    
    // Getters e Setters
}