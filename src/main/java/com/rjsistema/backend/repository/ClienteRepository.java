package com.rjsistema.backend.repository;

import com.rjsistema.backend.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    // Busca customizada para validação coesa no service (SOLID)
    Optional<Cliente> findByCnpjCpf(String cnpjCpf);
}
