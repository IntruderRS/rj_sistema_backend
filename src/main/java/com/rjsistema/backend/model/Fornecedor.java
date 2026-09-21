package com.rjsistema.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "tbl_fornecedores")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fornecedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "razao_social", nullable = false, length = 150)
    private String nomeRazao;

    @Column(name = "nome_fantasia", length = 100)
    private String nomeFantasia;

    @Column(nullable = false, unique = true, length = 20)
    private String cnpj;

    @Column(name = "inscricao_estadual", length = 50)
    private String ie;

    @Column(name = "ramo_atividade", length = 100)
    private String atividade;

    @Column(name = "nome_vendedor", length = 100)
    private String vendedor;

    @Column(name = "telefone_contato", length = 20)
    private String contato;

    @Column(length = 150)
    private String email;

    @Column(length = 150)
    private String rua;

    @Column(length = 100)
    private String bairro;

    @Column(length = 100)
    private String cidade;

    @Column(length = 2)
    private String estado;

    @Column(length = 10)
    private String cep;

    @Column(name = "data_cadastro", nullable = false)
    private LocalDate dataCadastro;

    @Column(name = "dados_bancarios", length = 250)
    private String dadosBanco;

    @Lob
    private String observacoes;
}
