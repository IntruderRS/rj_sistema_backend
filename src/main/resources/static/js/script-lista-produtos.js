(function() {
    const tbody = document.getElementById("tbodyListaProdutos");
    const txtFiltro = document.getElementById("txtFiltroProduto");
    if (!tbody) return;

    const API_URL = "http://localhost:8080/api/produtos";
    let cacheProdutos = [];

    const formatadorMoeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

    function carregarRelatorioProdutos() {
        fetch(API_URL)
            .then(res => res.json())
            .then(dados => {
                cacheProdutos = dados;
                renderizarGradeProdutos(cacheProdutos);
            })
            .catch(err => alert("Erro ao ler catálogo de produtos: " + err.message));
    }

    function renderizarGradeProdutos(lista) {
        tbody.innerHTML = "";

        if (lista.length === 0) {
            tbody.innerHTML = `<tr><td colspan="15" style="text-align: center; color: #94a3b8; padding: 30px;">Nenhum produto cadastrado no catálogo do banco MySQL.</td></tr>`;
            return;
        }

        lista.forEach(p => {
            let vencimentoBr = "-";
            if (p.dataVencimento) {
                vencimentoBr = p.dataVencimento.split("-").reverse().join("/");
            }

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="text-align: center; font-weight: bold;">${p.id}</td>
                <td style="font-weight: 600; white-space: nowrap;">${p.nome}</td>
                <td style="text-align: right; font-family: monospace;">${formatadorMoeda.format(p.valorCusto)}</td>
                <td style="text-align: center; color: #16a34a; font-weight: bold;">${p.porcentagemLucro.toFixed(1)}%</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold;">${formatadorMoeda.format(p.valorVenda)}</td>
                <td style="text-align: center; font-weight: bold; color: ${p.quantidadeEstoque <= 5 ? '#ef4444' : '#334155'}">${p.quantidadeEstoque}</td>
                <td style="text-align: center;">${p.peso ? p.peso.toFixed(3) : "0.000"}</td>
                <td>${p.dimensoes || "-"}</td>
                <td><code>${p.codigoBarras || "-"}</code></td>
                <td>${p.ncm || "-"}</td>
                <td>${p.lote || "-"}</td>
                <td style="text-align: center;">${vencimentoBr}</td>
                <td><span class="kpi-info" style="font-size:12px; font-weight:600; color:#0284c7;">${p.categoria ? p.categoria.nome : "Sem Categoria"}</span></td>
                <td>ID Forn: ${p.fornecedorId || "-"}</td>
                <td style="text-align: center;">
                    <button type="button" class="btn-action-sm edit" data-id="${p.id}" title="Editar Produto"><i class="fa-solid fa-boxes-packing"></i></button>
                    <button type="button" class="btn-action-sm delete" data-id="${p.id}" title="Excluir Produto"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        configurarAcoesDoGrid();
    }

    txtFiltro.addEventListener("input", () => {
        const termo = txtFiltro.value.toLowerCase().trim();
        const filtrados = cacheProdutos.filter(p => 
            p.nome.toLowerCase().includes(termo) || 
            p.codigoBarras.includes(termo) || 
            p.lote.toLowerCase().includes(termo)
        );
        renderizarGradeProdutos(filtrados);
    });

    function configurarAcoesDoGrid() {
        tbody.querySelectorAll(".btn-action-sm.delete").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                if (confirm(`Deseja remover permanentemente o produto ID ${id} do estoque?`)) {
                    fetch(`${API_URL}/${id}`, { method: "DELETE" })
                        .then(res => {
                            if (!res.ok) throw new Error("A API barrou a exclusão.");
                            alert("Produto removido com sucesso!");
                            carregarRelatorioProdutos();
                        })
                        .catch(err => alert("Erro ao excluir: " + err.message));
                }
            });
        });

        tbody.querySelectorAll(".btn-action-sm.edit").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.getAttribute("data-id"));
                const prod = cacheProdutos.find(p => p.id === id);
                if (prod) {
                    const itemMenu = document.querySelector('.submenu-item[data-target="produtos"]');
                    if (itemMenu) {
                        itemMenu.click();
                        setTimeout(() => {
                            document.getElementById("txtIDProduto").value = prod.id;
                            document.getElementById("txtNomeProduto").value = prod.nome;
                            document.getElementById("txtValorCusto").value = prod.valorCusto.toFixed(2).replace(".", ",");
                            document.getElementById("txtPorcentagemLucro").value = prod.porcentagemLucro.toFixed(1).replace(".", ",");
                            document.getElementById("txtValorVenda").value = prod.valorVenda.toFixed(2).replace(".", ",");
                            document.getElementById("txtQuantidadeEstoque").value = prod.quantidadeEstoque;
                            document.getElementById("txtPeso").value = prod.peso ? prod.peso.toFixed(3).replace(".", ",") : "0,000";
                            document.getElementById("txtDimensoes").value = prod.dimensoes || "";
                            document.getElementById("txtCodigoBarras").value = prod.codigoBarras || "";
                            document.getElementById("txtNCM").value = prod.ncm || "";
                            document.getElementById("txtLote").value = prod.lote || "";
                            document.getElementById("txtVencimento").value = prod.dataVencimento || "";
                            document.getElementById("txtObservacaoProduto").value = prod.observacao || "";
                            document.getElementById("cbCategoriaProduto").value = prod.categoria ? prod.categoria.id : "";
                            document.getElementById("cbFornecedorProduto").value = prod.fornecedorId || "";
                        }, 150);
                    }
                }
            });
        });
    }

    carregarRelatorioProdutos();
})();
