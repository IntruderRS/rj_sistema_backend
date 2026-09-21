(function() {
    const tbody = document.getElementById("tbodyListaPedidos");
    const txtFiltro = document.getElementById("txtFiltroPedido");
    if (!tbody) return;

    // Carga de dados simulando o banco de dados do MySQL
    let pedidosCadastrados = [
        { id: 1, data: "2026-07-21 14:30:00", cliente: "ALFA TRANSPORTES LTDA", pagto: "PIX", freteVal: 25.00, desc: 5.0, imposto: 0.0, total: 1500.00, freteTipo: "SEDEX", status: "FINALIZADO" },
        { id: 2, data: "2026-07-21 15:12:00", cliente: "MECÂNICA DO GORDO LTDA", pagto: "CARTÃO CRÉDITO", freteVal: 18.50, desc: 0.0, imposto: 5.0, total: 890.50, freteTipo: "PAC", status: "FINALIZADO" },
        { id: 4, data: "2026-07-21 16:45:00", cliente: "CHRISTIAN DE SOUZA SILVA", pagto: "CARTÃO DÉBITO", freteVal: 50.00, desc: 0.0, imposto: 0.0, total: 15500.00, freteTipo: "CIF", status: "FINALIZADO" }
    ];

    // Formatador de Moeda Regional Brasileiro (Ex: R$ 15.500,00)
    const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    // FUNÇÃO QUE DESENHA O GRID VISUAL DE HISTÓRICO DE VENDAS
    function renderizarGridPedidos(listaParaExibir) {
        tbody.innerHTML = "";

        if (listaParaExibir.length === 0) {
            tbody.innerHTML = `<tr><td colspan="11" style="text-align: center; color: #94a3b8; padding: 30px;">Nenhum faturamento localizado com os termos informados.</td></tr>`;
            return;
        }

        listaParaExibir.forEach(p => {
            // Converte a data internacional ISO do MySQL para o formato de exibição regional do PI
            let dataSplit = p.data.split(" ");
            let dataBr = dataSplit[0].split("-").reverse().join("/");
            let horaBr = dataSplit[1].substring(0, 5);
            let dataHoraFormatada = `${dataBr} ${horaBr}`;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="font-weight: bold; text-align: center;">${p.id}</td>
                <td style="text-align: center; font-size: 13px; color: #475569;">${dataHoraFormatada}</td>
                <td style="font-weight: 600; white-space: nowrap;">${p.cliente}</td>
                <td><span class="kpi-info" style="font-size:11px; font-weight:700; color:#475569;">${p.pagto}</span></td>
                <td style="text-align: right; font-family: monospace;">${formatadorMoeda.format(p.freteVal)}</td>
                <td style="text-align: center; color: #ef4444; font-weight: bold;">${p.desc > 0 ? p.desc + '%' : '-'}</td>
                <td style="text-align: right; font-family: monospace;">${formatadorMoeda.format(p.imposto)}</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold; color: #16a34a;">${formatadorMoeda.format(p.total)}</td>
                <td style="text-align: center; font-size: 13px;">${p.freteTipo || "-"}</td>
                <td style="text-align: center;"><span style="background-color: #dcfce7; color: #15803d; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">${p.status}</span></td>
                <td style="text-align: center;">
                    <button type="button" class="btn-action-sm edit" data-id="${p.id}" title="Reabrir / Editar Pedido no PDV"><i class="fa-solid fa-receipt"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        configurarEventosGrid();
    }

    // PESQUISA EM TEMPO REAL SEM REFRESH
    txtFiltro.addEventListener("input", () => {
        const termo = txtFiltro.value.toLowerCase().trim();
        const filtrados = pedidosCadastrados.filter(p => 
            p.cliente.toLowerCase().includes(termo) || 
            p.pagto.toLowerCase().includes(termo) || 
            p.status.toLowerCase().includes(termo)
        );
        renderizarGridPedidos(filtrados);
    });

    // REDIRECIONAMENTO COMPREENSIVO PARA O PDV WEB (SOLID)
    function configurarEventosGrid() {
        tbody.querySelectorAll(".btn-action-sm.edit").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.getAttribute("data-id"));
                alert(`Direcionando dados estruturados do Pedido ID ${id} para carregamento e reedição dentro do Painel PDV Web...`);
                
                // Aciona a transição visual clicando automaticamente no botão "Pedidos" do menu lateral
                const itemMenuPedidos = document.querySelector('.menu-item[data-target="pedidos"]');
                if (itemMenuPedidos) {
                    itemMenuPedidos.click();
                    
                    // Os dados serão injetados e carregados na tela de Pedidos assim que a estruturarmos na próxima etapa
                }
            });
        });
    }

    renderizarGridPedidos(pedidosCadastrados);
})();
