package com.rjsistema.backend.service;

import com.rjsistema.backend.model.Cliente;
import com.rjsistema.backend.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    public Cliente salvar(Cliente cliente) {
        // Regra de Consistência: Impede duplicação de CNPJ/CPF em cadastros novos
        if (cliente.getId() == null) {
            Optional<Cliente> existente = clienteRepository.findByCnpjCpf(cliente.getCnpjCpf());
            if (existente.isPresent()) {
                throw new IllegalArgumentException("O CNPJ ou CPF informado já encontra-se vinculado a outro cliente!");
            }
        }
        return clienteRepository.save(cliente);
    }

    public void deletar(Long id) {
        clienteRepository.deleteById(id);
    }
}
