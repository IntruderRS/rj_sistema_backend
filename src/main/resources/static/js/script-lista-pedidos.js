(function() {
    const tbody = document.getElementById("tbodyListaPedidos");
    const txtFiltro = document.getElementById("txtFiltroPedido");
    if (!tbody) return;

    const API_URL = "http://localhost:8080/api/pedidos";
    let cachePedidos = [];
    const formatadorMoeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

    function carregarHistoricoDeVendas() {
        fetch(API_URL)
            .then(res => res.json())
            .then(dados => {
                cachePedidos = dados;
                renderizarGradePedidos(cachePedidos);
            })
            .catch(err => alert("Erro ao ler histórico da API: " + err.message));
    }

    function renderizarGradePedidos(lista) {
        tbody.innerHTML = "";

        if (lista.length === 0) {
            tbody.innerHTML = `<tr><td colspan="11" style="text-align: center; color: #94a3b8; padding: 30px;">Nenhum faturamento registrado no arquivo do banco de dados.</td></tr>`;
            return;
        }

        lista.forEach(p => {
            // Conversão de data e hora vinda do LocalDateTime Java
            let dataHoraFormatada = "-";
            if (p.data) {
                const partes = p.data.split("T");
                const dataBr = partes[0].split("-").reverse().join("/");
                const horaBr = partes[1].substring(0, 5);
                dataHoraFormatada = `${dataBr} ${horaBr}`;
            }

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="font-weight: bold; text-align: center;">${p.id}</td>
                <td style="text-align: center; font-size: 13px; color: #475569;">${dataHoraFormatada}</td>
                <td style="font-weight: 600; white-space: nowrap;">${p.cliente ? p.cliente.nomeRazao : "Cliente Não Informado"}</td>
                <td><span class="kpi-info" style="font-size:11px; font-weight:700; color:#475569;">${p.pagto}</span></td>
                <td style="text-align: right; font-family: monospace;">${formatadorMoeda.format(p.freteVal)}</td>
                <td style="text-align: center; color: #ef4444; font-weight: bold;">${p.desc > 0 ? p.desc + '%' : '-'}</td>
                <td style="text-align: right; font-family: monospace;">${formatadorMoeda.format(p.imposto)}</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold; color: #16a34a;">${formatadorMoeda.format(p.total)}</td>
                <td style="text-align: center; font-size: 13px;">${p.freteTipo || "-"}</td>
                <td style="text-align: center;"><span style="background-color: #dcfce7; color: #15803d; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">${p.status}</span></td>
                <td style="text-align: center;">
                    <button type="button" class="btn-action-sm edit" data-id="${p.id}" title="Visualizar Pedido faturado"><i class="fa-solid fa-receipt"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    txtFiltro.addEventListener("input", () => {
        const termo = txtFiltro.value.toLowerCase().trim();
        const filtrados = cachePedidos.filter(p => 
            (p.cliente && p.cliente.nomeRazao.toLowerCase().includes(termo)) || 
            p.pagto.toLowerCase().includes(termo) || 
            p.status.toLowerCase().includes(termo)
        );
        renderizarGradePedidos(filtrados);
    });

    carregarHistoricoDeVendas();
})();
