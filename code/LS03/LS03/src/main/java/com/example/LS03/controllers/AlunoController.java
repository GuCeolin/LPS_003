package com.example.LS03.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.LS03.models.Aluno;
import com.example.LS03.repositories.AlunoRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/alunos")
public class AlunoController {

    @Autowired
    private AlunoRepository alunoRepository;

    @GetMapping
    public List<Aluno> listarAlunos() {
        return alunoRepository.findAll();
    }

    @PostMapping
    public Aluno criarAluno(@RequestBody Aluno aluno) {
        return alunoRepository.save(aluno);
    }

    @GetMapping("/{id}")
    public Optional<Aluno> buscarAluno(@PathVariable Long id) {
        return alunoRepository.findById(id);
    }

    @PutMapping("/{id}")
    public Aluno atualizarAluno(@PathVariable Long id, @RequestBody Aluno alunoDetalhes) {
        Aluno aluno = alunoRepository.findById(id).orElseThrow();
        aluno.setNome(alunoDetalhes.getNome());
        aluno.setEmail(alunoDetalhes.getEmail());
        aluno.setCurso(alunoDetalhes.getCurso());
        return alunoRepository.save(aluno);
    }

    @DeleteMapping("/{id}")
    public void deletarAluno(@PathVariable Long id) {
        alunoRepository.deleteById(id);
    }
}
