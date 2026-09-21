package com.rjsistema.backend.service;

import com.rjsistema.backend.model.Usuario;
import com.rjsistema.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario salvar(Usuario usuario) {
        // Regra de Consistência: Impede logins duplicados
        if (usuario.getId() == null) {
            Optional<Usuario> existente = usuarioRepository.findByLogin(usuario.getLogin());
            if (existente.isPresent()) {
                throw new IllegalArgumentException("O login informado já está em uso por outro operador!");
            }
        }
        
        // Criptografia de Segurança: Aplica HASH SHA-256 (Garante conformidade com a LGPD)
        if (usuario.getSenha() != null && !usuario.getSenha().startsWith("******")) {
            usuario.setSenha(gerarHashSHA256(usuario.getSenha()));
        }
        
        return usuarioRepository.save(usuario);
    }

    public void deletar(Long id) {
        if (id == 1) {
            throw new IllegalArgumentException("Segurança: O usuário administrador master não pode ser deletado!");
        }
        usuarioRepository.deleteById(id);
    }

    // Algoritmo matemático puro de hash Criptográfico hexadecimal
    private String gerarHashSHA256(String senhaPura) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(senhaPura.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao processar segurança criptográfica", e);
        }
    }
}
