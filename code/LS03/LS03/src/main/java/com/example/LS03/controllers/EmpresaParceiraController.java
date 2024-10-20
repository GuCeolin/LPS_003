package com.example.LS03.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.LS03.models.EmpresaParceira;
import com.example.LS03.repositories.EmpresaParceiraRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/empresas")
public class EmpresaParceiraController {

    @Autowired
    private EmpresaParceiraRepository empresaParceiraRepository;

    @GetMapping
    public List<EmpresaParceira> listarEmpresas() {
        return empresaParceiraRepository.findAll();
    }

    @PostMapping
    public EmpresaParceira criarEmpresa(@RequestBody EmpresaParceira empresa) {
        return empresaParceiraRepository.save(empresa);
    }

    @GetMapping("/{id}")
    public Optional<EmpresaParceira> buscarEmpresa(@PathVariable Long id) {
        return empresaParceiraRepository.findById(id);
    }

    @PutMapping("/{id}")
    public EmpresaParceira atualizarEmpresa(@PathVariable Long id, @RequestBody EmpresaParceira empresaDetalhes) {
        EmpresaParceira empresa = empresaParceiraRepository.findById(id).orElseThrow();
        empresa.setNome(empresaDetalhes.getNome());
        empresa.setCnpj(empresaDetalhes.getCnpj());
        empresa.setSetor(empresaDetalhes.getSetor());
        return empresaParceiraRepository.save(empresa);
    }

    @DeleteMapping("/{id}")
    public void deletarEmpresa(@PathVariable Long id) {
        empresaParceiraRepository.deleteById(id);
    }
}
