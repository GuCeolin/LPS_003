package com.example.LS03.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.LS03.models.Aluno;
import com.example.LS03.repositories.AlunoRepository;

@Service
public class AlunoService {
    
    @Autowired
    private AlunoRepository alunoRepository;
    
    public Aluno cadastrarAluno(Aluno aluno) {
        // lógica de cadastro de aluno
        return alunoRepository.save(aluno);
    }
    
    public List<Aluno> listarAlunos() {
        return alunoRepository.findAll();
    }
    
    public void adicionarMoedas(Aluno aluno, int quantidade) {
        aluno.receberMoedas(quantidade, "Motivo");
        alunoRepository.save(aluno);
    }
}