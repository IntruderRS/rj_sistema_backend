package com.rjsistema.backend.controller;

import com.rjsistema.backend.repository.ClienteRepository;
import com.rjsistema.backend.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @GetMapping("/kpis")
    public Map<String, Object> obterIndicadoresMensais() {
        LocalDate hoje = LocalDate.now();
        int mesAtual = hoje.getMonthValue();
        int anoAtual = hoje.getYear();

        // Coleta os dados em tempo real direto das agregadoras do MySQL
        BigDecimal faturamento = pedidoRepository.somarFaturamentoMensal(mesAtual, anoAtual);
        Long totalPedidos = pedidoRepository.contarPedidosMensais(mesAtual, anoAtual);
        Long totalClientes = clienteRepository.contarTotalClientesNovos();

        // Monta o payload JSON customizado de alta performance (SOLID)
        Map<String, Object> kpis = new HashMap<>();
        kpis.put("faturamentoMensal", faturamento);
        kpis.put("pedidosFaturados", totalPedidos);
        kpis.put("clientesNovos", totalClientes);

        return kpis;
    }
    
    @GetMapping("/grafico-vendas")
public List<Map<String, Object>> obterDadosGrafico() {
    List<Object[]> resultados = pedidoRepository.buscarTopCategoriasUltimos3Meses();
    List<Map<String, Object>> listaGrafico = new java.util.ArrayList<>();

    for (Object[] linha : resultados) {
        Map<String, Object> mapa = new java.util.HashMap<>();
        mapa.put("categoria", linha[0]);
        mapa.put("quantidade", linha[1]);
        listaGrafico.add(mapa);
    }
    return listaGrafico;
}
}
