package com.rjsistema.backend.service;

import com.rjsistema.backend.model.ItemPedido;
import com.rjsistema.backend.model.Pedido;
import com.rjsistema.backend.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    public Pedido salvar(Pedido pedido) {
        if (pedido.getItens() == null || pedido.getItens().isEmpty()) {
            throw new IllegalArgumentException("Não é possível faturar um pedido sem itens no carrinho!");
        }

        // Auditoria de Data
        if (pedido.getId() == null) {
            pedido.setData(LocalDateTime.now());
            pedido.setStatus("FINALIZADO");
        }

        // 1. Calcula o Subtotal multiplicando reativamente cada item (Qtd * Preco)
        BigDecimal somatorioItens = BigDecimal.ZERO;
        for (ItemPedido item : pedido.getItens()) {
            if (item.getPreco() != null && item.getQuantidade() != null) {
                BigDecimal sub = item.getPreco().multiply(new BigDecimal(item.getQuantidade()));
                item.setSubtotal(sub.setScale(2, RoundingMode.HALF_UP));
                somatorioItens = somatorioItens.add(sub);
            }
        }

        // 2. Coleta taxas adicionais passadas pelo operador
        BigDecimal frete = pedido.getFreteVal() != null ? pedido.getFreteVal() : BigDecimal.ZERO;
        BigDecimal imposto = pedido.getImposto() != null ? pedido.getImposto() : BigDecimal.ZERO;
        BigDecimal descPorcentagem = pedido.getDesc() != null ? pedido.getDesc() : BigDecimal.ZERO;

        // 3. Executa as equações compostas de fechamento (Base + Frete + Imposto)
        BigDecimal totalProvisorio = somatorioItens.add(frete).add(imposto);
        
        // Aplica a taxa percentual de abatimento do PIX ou cupom
        BigDecimal fatorDesconto = descPorcentagem.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        BigDecimal abatimento = totalProvisorio.multiply(fatorDesconto);
        
        BigDecimal valorLiquidoFinal = totalProvisorio.subtract(abatimento);
        
        pedido.setTotal(valorLiquidoFinal.setScale(2, RoundingMode.HALF_UP));

        return pedidoRepository.save(pedido);
    }
}
