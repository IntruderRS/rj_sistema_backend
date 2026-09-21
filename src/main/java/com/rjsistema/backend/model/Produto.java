package com.rjsistema.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "tbl_produtos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(name = "valor_custo", precision = 10, scale = 2)
    private BigDecimal valorCusto;

    @Column(name = "porcentagem_lucro", precision = 5, scale = 2)
    private BigDecimal porcentagemLucro;

    @Column(name = "valor_venda", precision = 10, scale = 2)
    private BigDecimal valorVenda;

    @Column(nullable = false)
    private Integer quantidadeEstoque;

    @Column(precision = 6, scale = 3)
    private BigDecimal peso;

    @Column(length = 50)
    private String dimensoes;

    @Column(name = "codigo_barras", length = 50)
    private String codigoBarras;

    @Column(length = 8)
    private String ncm;

    @Column(length = 50)
    private String lote;

    private LocalDate dataVencimento;

    @Lob
    private String observacao;

    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;
    
    // Fornecedor será mapeado na sequência quando criarmos o módulo dele
    @Column(name = "fornecedor_id")
    private Long fornecedorId;
}
