package com.rjsistema.backend.controller;

import com.rjsistema.backend.model.Fornecedor;
import com.rjsistema.backend.service.FornecedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/fornecedores")
@CrossOrigin(origins = "*")
public class FornecedorController {

    @Autowired
    private FornecedorService service;

    @GetMapping
    public List<Fornecedor> listar() {
        return service.listarTodos();
    }

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Fornecedor fornecedor) {
        try {
            Fornecedor salvo = service.salvar(fornecedor);
            return ResponseEntity.ok(salvo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
