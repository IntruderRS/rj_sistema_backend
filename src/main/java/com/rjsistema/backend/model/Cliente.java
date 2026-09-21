package com.rjsistema.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "tbl_clientes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_razao", nullable = false, length = 150)
    private String nomeRazao;

    @Column(name = "nome_fantasia", length = 100)
    private String nomeFantasia;

    @Column(name = "cnpj_cpf", nullable = false, unique = true, length = 20)
    private String cnpjCpf;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    // ALINHADO AO FRONT: Campo de profissão/atividade integrado com sucesso
    @Column(name = "profissao_atividade", length = 100)
    private String profissaoAtividade;

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

    @Column(length = 20)
    private String telefone;

    @Column(length = 20)
    private String whatsapp;

    @Column(length = 150)
    private String email;

    @Lob
    private String observacao;
}
