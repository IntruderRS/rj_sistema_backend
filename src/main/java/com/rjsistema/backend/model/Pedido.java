package com.rjsistema.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tbl_pedidos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime data;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Column(name = "forma_pagamento", nullable = false, length = 50)
    private String pagto;

    @Column(name = "tipo_frete", length = 30)
    private String freteTipo;

    @Column(name = "valor_frete", precision = 10, scale = 2)
    private BigDecimal freteVal;

    @Column(name = "porcentagem_desconto", precision = 5, scale = 2)
    private BigDecimal desc;

    @Column(precision = 10, scale = 2)
    private BigDecimal imposto;

    @Column(name = "valor_total_liquido", nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Column(length = 30, nullable = false)
    private String status;

    // Relação Mestre-Detalhe: Salvar o Pedido salva os itens juntos na hora (CascadeType.ALL)
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "pedido_id")
    private List<ItemPedido> itens = new ArrayList<>();
}
