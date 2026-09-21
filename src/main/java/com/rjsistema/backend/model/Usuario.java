package com.rjsistema.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tbl_usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true, length = 50)
    private String login;

    @Column(nullable = false, length = 50)
    private String tipoPerfil;

    @Column(nullable = false, length = 64) // Comprimento adequado para o Hash hexadecimal
    private String senha;

    // Mapeamento automático da tabela associativa de privilégios (Roles)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "tbl_usuario_permissoes", joinColumns = @JoinColumn(name = "usuario_id"))
    @Column(name = "permissao")
    private Set<String> roles = new HashSet<>();
}
