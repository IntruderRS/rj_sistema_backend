package com.rjsistema.backend.repository;

import com.rjsistema.backend.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    
    Optional<Cliente> findByCnpjCpf(String cnpjCpf);

    // QUERY 3: Rastreia novos clientes (assumindo que no insert do banco foi mapeado a data ou contando todos para a métrica do PI)
    // Se o seu banco não tiver coluna de auditoria de data do cliente, podemos contar o total de clientes ativos para o KPI
    @Query(value = "SELECT COUNT(c.id) FROM tbl_clientes c", nativeQuery = true)
    Long contarTotalClientesNovos();
}
