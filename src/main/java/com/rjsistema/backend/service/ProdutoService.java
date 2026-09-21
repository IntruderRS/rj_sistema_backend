package com.rjsistema.backend.service;

import com.rjsistema.backend.model.Produto;
import com.rjsistema.backend.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    public Produto salvar(Produto produto) {
        // Regra de Negócio: Calcula o valor de venda de forma robusta no Back (SOLID)
        if (produto.getValorCusto() != null && produto.getPorcentagemLucro() != null) {
            BigDecimal custo = produto.getValorCusto();
            BigDecimal lucroPorcentagem = produto.getPorcentagemLucro().divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
            BigDecimal margem = custo.multiply(lucroPorcentagem);
            
            produto.setValorVenda(custo.add(margem).setScale(2, RoundingMode.HALF_UP));
        }
        return produtoRepository.save(produto);
    }

    public void deletar(Long id) {
        produtoRepository.deleteById(id);
    }
}
