package com.rjsistema.backend.repository;

import com.rjsistema.backend.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // QUERY 1: Soma o valor total líquido de todos os pedidos finalizados no mês e ano atual
    @Query(value = "SELECT COALESCE(SUM(p.valor_total_liquido), 0) FROM tbl_pedidos p " +
                   "WHERE MONTH(p.data_hora) = :mes AND YEAR(p.data_hora) = :ano AND p.status = 'FINALIZADO'", 
           nativeQuery = true)
    BigDecimal somarFaturamentoMensal(@Param("mes") int mes, @Param("ano") int ano);

    // QUERY 2: Conta a quantidade de registros de pedidos fechados no mês e ano atual
    @Query(value = "SELECT COUNT(p.id) FROM tbl_pedidos p " +
                   "WHERE MONTH(p.data_hora) = :mes AND YEAR(p.data_hora) = :ano AND p.status = 'FINALIZADO'", 
           nativeQuery = true)
    Long contarPedidosMensais(@Param("mes") int mes, @Param("ano") int ano);
    
    @Query(value = "SELECT c.nome, COALESCE(SUM(i.quantidade), 0) AS total_vendido " +
               "FROM tbl_pedido_itens i " +
               "JOIN tbl_produtos p ON i.produto_id = p.id " +
               "JOIN tbl_categorias c ON p.categoria_id = c.id " +
               "JOIN tbl_pedidos ped ON i.pedido_id = ped.id " +
               "WHERE ped.data_hora >= DATE_SUB(NOW(), INTERVAL 3 MONTH) " +
               "AND ped.status = 'FINALIZADO' " +
               "GROUP BY c.id, c.nome " +
               "ORDER BY total_vendido DESC " +
               "LIMIT 4", nativeQuery = true)
List<Object[]> buscarTopCategoriasUltimos3Meses();
}
