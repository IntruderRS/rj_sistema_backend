(function() {
    const tbody = document.getElementById("tbodyListaProdutos");
    const txtFiltro = document.getElementById("txtFiltroProduto");
    if (!tbody) return;

    // Carga de dados simulando o banco de dados
    let produtosCadastrados = [
        { id: 1, nome: "Oleo Motor Lubrax Tecno 10W40 Semisintetico 1L", custo: 25.00, lucro: 40.0, venda: 37.50, qtd: 150, peso: 0.95, dim: "10x10x22 cm", barras: "7891234560012", ncm: "27101932", lote: "LT2026-01", vencimento: "2031-07-21", cat: "Lubrificantes", forn: "Lubrax Distribuidora S/A", catId: "1", fornId: "1" },
        { id: 2, nome: "Pneu Pirelli Cinturato P7 205/55R16 91V", custo: 350.00, lucro: 30.0, venda: 490.00, qtd: 40, peso: 8.50, dim: "60x60x20 cm", barras: "7891234560029", ncm: "40111000", lote: "PR2026-A", vencimento: "", cat: "Pneus", forn: "Pneus Pirelli Ind e Com", catId: "2", fornId: "2" },
        { id: 3, nome: "Pastilha de Freio Dianteira Bosch Eco", custo: 60.00, lucro: 50.0, venda: 90.00, qtd: 80, peso: 1.20, dim: "15x8x6 cm", barras: "7891234560036", ncm: "87083019", lote: "BS-Freios05", vencimento: "", cat: "Freios", forn: "Bosch Sistemas de Freio", catId: "3", fornId: "3" }
    ];

    // Formatador de Moeda Regional Brasileiro (Ex: R$ 1.500,00)
    const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    // FUNÇÃO QUE DESENHA O GRID VISUAL DE PRODUTOS
    function renderizarGridProdutos(listaParaExibir) {
        tbody.innerHTML = "";

        if (listaParaExibir.length === 0) {
            tbody.innerHTML = `<tr><td colspan="15" style="text-align: center; color: #94a3b8; padding: 30px;">Nenhum produto localizado.</td></tr>`;
            return;
        }

        listaParaExibir.forEach(p => {
            // Conversão de data ISO para o padrão brasileiro visual
            let vencimentoBr = "-";
            if (p.vencimento) {
                const partes = p.vencimento.split("-");
                if (partes.length === 3) vencimentoBr = `${partes[2]}/${partes[1]}/${partes[0]}`;
            }

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="font-weight: bold; text-align: center;">${p.id}</td>
                <td style="font-weight: 600; white-space: nowrap;">${p.nome}</td>
                <td style="text-align: right; font-family: monospace;">${formatadorMoeda.format(p.custo)}</td>
                <td style="text-align: center; color: #16a34a; font-weight: bold;">${p.lucro.toFixed(1)}%</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold; color: #1e293b;">${formatadorMoeda.format(p.venda)}</td>
                <td style="text-align: center; font-weight: bold; color: ${p.qtd <= 5 ? '#ef4444' : '#334155'}">${p.qtd}</td>
                <td style="text-align: center;">${p.peso.toFixed(3)}</td>
                <td>${p.dim || "-"}</td>
                <td><code>${p.barras || "-"}</code></td>
                <td>${p.ncm || "-"}</td>
                <td>${p.lote || "-"}</td>
                <td style="text-align: center;">${vencimentoBr}</td>
                <td><span class="kpi-info" style="font-size:12px; font-weight:600; color:#0284c7;">${p.cat}</span></td>
                <td>${p.forn}</td>
                <td style="text-align: center;">
                    <button type="button" class="btn-action-sm edit" data-id="${p.id}" title="Editar Produto"><i class="fa-solid fa-boxes-packing"></i></button>
                    <button type="button" class="btn-action-sm delete" data-id="${p.id}" title="Excluir Produto"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        configurarEventosGrid();
    }

    // PESQUISA EM TEMPO REAL SEM REFRESH
    txtFiltro.addEventListener("input", () => {
        const termo = txtFiltro.value.toLowerCase().trim();
        const filtrados = produtosCadastrados.filter(p => 
            p.nome.toLowerCase().includes(termo) || 
            p.barras.includes(termo) || 
            p.lote.toLowerCase().includes(termo)
        );
        renderizarGridProdutos(filtrados);
    });

    // REDIRECIONAMENTO E ENVELOPE DE MANUTENÇÃO (SOLID)
    function configurarEventosGrid() {
        tbody.querySelectorAll(".btn-action-sm.edit").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.getAttribute("data-id"));
                const prod = produtosCadastrados.find(p => p.id === id);
                
                if (prod) {
                    alert(`Despachando objeto do Produto ID ${id} para a rota de edição...`);
                    
                    const itemMenuProdutos = document.querySelector('.submenu-item[data-target="produtos"]');
                    if (itemMenuProdutos) {
                        itemMenuProdutos.click(); // Força alternância de tela para o Formulário de Cadastro
                        
                        setTimeout(() => {
                            if (document.getElementById("txtIDProduto")) {
                                document.getElementById("txtIDProduto").value = prod.id;
                                document.getElementById("txtNomeProduto").value = prod.nome;
                                document.getElementById("txtValorCusto").value = prod.custo.toFixed(2).replace(".", ",");
                                document.getElementById("txtPorcentagemLucro").value = prod.lucro.toFixed(1).replace(".", ",");
                                document.getElementById("txtValorVenda").value = prod.venda.toFixed(2).replace(".", ",");
                                document.getElementById("txtQuantidadeEstoque").value = prod.qtd;
                                document.getElementById("txtPeso").value = prod.peso.toFixed(3).replace(".", ",");
                                document.getElementById("txtDimensoes").value = prod.dim;
                                document.getElementById("txtCodigoBarras").value = prod.barras;
                                document.getElementById("txtNCM").value = prod.ncm;
                                document.getElementById("txtLote").value = prod.lote;
                                document.getElementById("txtVencimento").value = prod.vencimento;
                                document.getElementById("cbCategoriaProduto").value = prod.catId;
                                document.getElementById("cbFornecedorProduto").value = prod.fornId;
                            }
                        }, 100);
                    }
                }
            });
        });

        tbody.querySelectorAll(".btn-action-sm.delete").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.getAttribute("data-id"));
                if (confirm(`Deseja remover permanentemente o produto ID ${id} do catálogo?`)) {
                    produtosCadastrados = produtosCadastrados.filter(p => p.id !== id);
                    renderizarGridProdutos(produtosCadastrados);
                }
            });
        });
    }

    renderizarGridProdutos(produtosCadastrados);
})();
