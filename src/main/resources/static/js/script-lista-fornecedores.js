(function() {
    const tbody = document.getElementById("tbodyListaFornecedores");
    const txtFiltro = document.getElementById("txtFiltroFornecedor");
    if (!tbody) return;

    const API_URL = "http://localhost:8080/api/fornecedores";
    let cacheFornecedores = [];

    // 1. CARGA (GET): Lê os dados da REST API do Spring Boot
    function carregarRelatorioFornecedores() {
        fetch(API_URL)
            .then(res => res.json())
            .then(dados => {
                cacheFornecedores = dados;
                renderizarGradeFornecedores(cacheFornecedores);
            })
            .catch(err => alert("Erro ao obter dados das distribuidoras: " + err.message));
    }

    // 2. REDESENHO DO GRID (Formatando as datas para o padrão nacional)
    function renderizarGradeFornecedores(lista) {
        tbody.innerHTML = "";

        if (lista.length === 0) {
            tbody.innerHTML = `<tr><td colspan="18" style="text-align: center; color: #94a3b8; padding: 30px;">Nenhum fornecedor registrado nas tabelas de banco de dados.</td></tr>`;
            return;
        }

        lista.forEach(f => {
            let dataBr = "-";
            if (f.dataCadastro) {
                dataBr = f.dataCadastro.split("-").reverse().join("/");
            }

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="font-weight: bold; text-align: center;">${f.id}</td>
                <td style="font-weight: 600; white-space: nowrap;">${f.nomeRazao}</td>
                <td style="white-space: nowrap;">${f.nomeFantasia || "-"}</td>
                <td><code>${f.cnpj}</code></td>
                <td>${f.ie || "-"}</td>
                <td>${f.atividade || "-"}</td>
                <td>${f.vendedor || "-"}</td>
                <td>${f.contato || "-"}</td>
                <td><a href="mailto:${f.email}" style="color:#0284c7; text-decoration:none;">${f.email || "-"}</a></td>
                <td style="white-space: nowrap;">${f.rua || "-"}</td>
                <td>${f.bairro || "-"}</td>
                <td>${f.cidade || "-"}</td>
                <td style="text-align: center;"><strong>${f.estado || "-"}</strong></td>
                <td>${f.cep || "-"}</td>
                <td style="text-align: center;">${dataBr}</td>
                <td style="white-space: nowrap;">${f.dadosBanco || "-"}</td>
                <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${f.observacoes}">${f.observacoes || "-"}</td>
                <td style="text-align: center;">
                    <button type="button" class="btn-action-sm edit" data-id="${f.id}" title="Editar Cadastro"><i class="fa-solid fa-truck-ramp-box"></i></button>
                    <button type="button" class="btn-action-sm delete" data-id="${f.id}" title="Remover Fornecedor"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        configurarAcoesDoGrid();
    }

    // Filtro instantâneo na digitação
    txtFiltro.addEventListener("input", () => {
        const termo = txtFiltro.value.toLowerCase().trim();
        const filtrados = cacheFornecedores.filter(f => 
            f.nomeRazao.toLowerCase().includes(termo) || 
            f.cnpj.includes(termo) || 
            f.cidade.toLowerCase().includes(termo)
        );
        renderizarGradeFornecedores(filtrados);
    });

    function configurarAcoesDoGrid() {
        // Ação de Deletar Registro real do banco via DELETE HTTP
        tbody.querySelectorAll(".btn-action-sm.delete").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                if (confirm(`Deseja revogar e excluir permanentemente o fornecedor ID ${id} do banco de dados?`)) {
                    fetch(`${API_URL}/${id}`, { method: "DELETE" })
                        .then(res => {
                            if (!res.ok) throw new Error("A API de segurança barrou a exclusão.");
                            alert("Distribuidora removida com sucesso!");
                            carregarRelatorioFornecedores();
                        })
                        .catch(err => alert("Erro ao excluir: " + err.message));
                }
            });
        });

        // Ação de Editar (Alterna para a tela de formulário e hidrata as caixas)
        tbody.querySelectorAll(".btn-action-sm.edit").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.getAttribute("data-id"));
                const forn = cacheFornecedores.find(f => f.id === id);
                if (forn) {
                    const itemMenu = document.querySelector('.submenu-item[data-target="fornecedores"]');
                    if (itemMenu) {
                        itemMenu.click();
                        setTimeout(() => {
                            document.getElementById("txtIDFornecedor").value = forn.id;
                            document.getElementById("txtRazaoSocial").value = forn.nomeRazao;
                            document.getElementById("txtNomeFantasiaFornecedor").value = forn.nomeFantasia || "";
                            document.getElementById("txtCNPJFornecedor").value = forn.cnpj;
                            document.getElementById("txtInscricaoEstadual").value = forn.ie || "";
                            document.getElementById("txtRuaFornecedor").value = forn.rua || "";
                            document.getElementById("txtBairroFornecedor").value = forn.bairro || "";
                            document.getElementById("txtCidadeFornecedor").value = forn.cidade || "";
                            document.getElementById("txtEstadoFornecedor").value = forn.estado || "";
                            document.getElementById("txtCEPFornecedor").value = forn.cep || "";
                            document.getElementById("txtRamoAtividade").value = forn.atividade || "";
                            document.getElementById("txtNomeVendedor").value = forn.vendedor || "";
                            document.getElementById("txtTelefoneFornecedor").value = forn.contato || "";
                            document.getElementById("txtEmailFornecedor").value = forn.email || "";
                            document.getElementById("txtDadosBancarios").value = forn.dadosBanco || "";
                            document.getElementById("txtObservacoesFornecedor").value = forn.observacoes || "";
                            document.getElementById("txtDataCadastroFornecedor").value = forn.dataCadastro;
                        }, 150);
                    }
                }
            });
        });
    }

    carregarRelatorioFornecedores();
})();
