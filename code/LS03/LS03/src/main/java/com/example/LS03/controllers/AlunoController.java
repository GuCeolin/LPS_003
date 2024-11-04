package com.example.LS03.controllers;

import java.util.Map; // Para Map
import java.util.HashMap; // Para HashMap
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;// Para @Autowired
import org.springframework.http.ResponseEntity; 

import java.util.List; // Para a interface List

import com.example.LS03.models.Aluno; // Para seu modelo Aluno
import com.example.LS03.repositories.AlunoRepository; // Para AlunoRepository


@RestController
@RequestMapping("/alunos")
public class AlunoController {

    @Autowired
    private AlunoRepository alunoRepository;

    // Listar todos os alunos
    @GetMapping
    public List<Aluno> getAllAlunos() {
        return alunoRepository.findAll();
    }

    // Criar novo aluno
    @PostMapping
    public Aluno createAluno(@RequestBody Aluno aluno) {
        return alunoRepository.save(aluno);
    }

    // Atualizar aluno
    @PutMapping("/{id}")
    public ResponseEntity<Aluno> updateAluno(@PathVariable Long id, @RequestBody Aluno alunoDetails) {
        Aluno aluno = alunoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        
        aluno.setCpf(alunoDetails.getCpf());
        aluno.setRg(alunoDetails.getRg());
        aluno.setEndereco(alunoDetails.getEndereco());
        aluno.setCurso(alunoDetails.getCurso());
        aluno.setSaldoMoedas(alunoDetails.getSaldoMoedas());

        final Aluno updatedAluno = alunoRepository.save(aluno);
        return ResponseEntity.ok(updatedAluno);
    }

    // Deletar aluno
    @DeleteMapping("/{id}")
    public Map<String, Boolean> deleteAluno(@PathVariable Long id) {
        Aluno aluno = alunoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        alunoRepository.delete(aluno);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }
}
