package com.rjsistema.backend.service;

import com.rjsistema.backend.model.Fornecedor;
import com.rjsistema.backend.repository.FornecedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class FornecedorService {

    @Autowired
    private FornecedorRepository fornecedorRepository;

    public List<Fornecedor> listarTodos() {
        return fornecedorRepository.findAll();
    }

    public Fornecedor salvar(Fornecedor fornecedor) {
        // Regra de Auditoria Coesa: Garante a data atual no insert
        if (fornecedor.getId() == null) {
            Optional<Fornecedor> existente = fornecedorRepository.findByCnpj(fornecedor.getCnpj());
            if (existente.isPresent()) {
                throw new IllegalArgumentException("O CNPJ informado já pertence a outra distribuidora cadastrada!");
            }
            if (fornecedor.getDataCadastro() == null) {
                fornecedor.setDataCadastro(LocalDate.now());
            }
        }
        return fornecedorRepository.save(fornecedor);
    }

    public void deletar(Long id) {
        fornecedorRepository.deleteById(id);
    }
}
