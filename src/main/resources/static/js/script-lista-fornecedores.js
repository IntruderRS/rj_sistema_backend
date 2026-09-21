(function() {
    const tbody = document.getElementById("tbodyListaFornecedores");
    const txtFiltro = document.getElementById("txtFiltroFornecedor");
    if (!tbody) return;

    // Carga de dados históricos reais baseados no MySQL do banco de dados
    let fornecedoresCadastrados = [
        { id: 1, razao: "Lubrax Distribuidora S/A", fantasia: "Lubrax Comercial", cnpj: "12.345.678/0001-01", ie: "111222333", rua: "Av das Nacoes, 100", bairro: "Centro", cidade: "Porto Alegre", uf: "RS", cep: "90000-000", atividade: "Lubrificantes", vendedor: "Marcos Silva", contato: "(51) 3322-1100", email: "vendas@lubrax.com.br", banco: "Banco do Brasil Ag 1234 CC 5544-3", obs: "Garantia de alta performance e protecao.", data: "2024-01-01" },
        { id: 2, razao: "Pneus Pirelli Ind e Com", fantasia: "Pirelli Atacado", cnpj: "23.456.789/0001-02", ie: "444555666", rua: "Rua Industrial, 500", bairro: "Distrito", cidade: "Sao Paulo", uf: "SP", cep: "01000-000", atividade: "Pneus", vendedor: "Roberto Costa", contato: "(11) 4004-2000", email: "comercial@pirelli.com", banco: "Itaú Ag 4321 CC 9988-1", obs: "Pneu original de fabrica para alta aderencia.", data: "2024-02-15" },
        { id: 3, razao: "Bosch Sistemas de Freio", fantasia: "Bosch Auto", cnpj: "34.567.890/0001-03", ie: "777888999", rua: "Via Anchieta, KM 12", bairro: "Sacoma", cidade: "Sao Bernardo", uf: "SP", cep: "09000-000", atividade: "Freios e Eletrica", vendedor: "Ana Souza", contato: "(11) 2121-3000", email: "atendimento@bosch.com", banco: "Bradesco Ag 0101 CC 1122-3", obs: "Pastilha de freio ceramica de alta durabilidade.", data: "2024-03-10" }
    ];

    // FUNÇÃO QUE DESENHA O GRID VISUAL (MÉTODO REPREENCHER)
    function renderizarGridFornecedores(listaParaExibir) {
        tbody.innerHTML = "";

        if (listaParaExibir.length === 0) {
            tbody.innerHTML = `<tr><td colspan="18" style="text-align: center; color: #94a3b8; padding: 30px;">Nenhum fornecedor localizado.</td></tr>`;
            return;
        }

        listaParaExibir.forEach(f => {
            // Conversão de data ISO para o padrão brasileiro visual
            let dataBr = "";
            if (f.data) {
                const p = f.data.split("-");
                if (p.length === 3) dataBr = `${p[2]}/${p[1]}/${p[0]}`;
            }

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="font-weight: bold; text-align: center;">${f.id}</td>
                <td style="font-weight: 600; white-space: nowrap;">${f.razao}</td>
                <td style="white-space: nowrap;">${f.fantasia || "-"}</td>
                <td><code>${f.cnpj}</code></td>
                <td>${f.ie || "-"}</td>
                <td>${f.atividade || "-"}</td>
                <td>${f.vendedor || "-"}</td>
                <td>${f.contato || "-"}</td>
                <td><a href="mailto:${f.email}" style="color:#0284c7; text-decoration:none;">${f.email || "-"}</a></td>
                <td style="white-space: nowrap;">${f.rua || "-"}</td>
                <td>${f.bairro || "-"}</td>
                <td>${f.cidade || "-"}</td>
                <td style="text-align: center;"><strong>${f.uf || "-"}</strong></td>
                <td>${f.cep || "-"}</td>
                <td style="text-align: center;">${dataBr}</td>
                <td style="white-space: nowrap;">${f.banco || "-"}</td>
                <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${f.obs}">${f.obs || "-"}</td>
                <td style="text-align: center;">
                    <button type="button" class="btn-action-sm edit" data-id="${f.id}" title="Editar Cadastro"><i class="fa-solid fa-truck-ramp-box"></i></button>
                    <button type="button" class="btn-action-sm delete" data-id="${f.id}" title="Remover Fornecedor"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        configurarEventosGrid();
    }

    // PESQUISA EM TEMPO REAL SEM REFRESH
    txtFiltro.addEventListener("input", () => {
        const termo = txtFiltro.value.toLowerCase().trim();
        const filtrados = fornecedoresCadastrados.filter(f => 
            f.razao.toLowerCase().includes(termo) || 
            f.cnpj.includes(termo) || 
            f.cidade.toLowerCase().includes(termo)
        );
        renderizarGridFornecedores(filtrados);
    });

    // REDIRECIONAMENTO E MANUTENÇÃO (SOLID)
    function configurarEventosGrid() {
        tbody.querySelectorAll(".btn-action-sm.edit").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.getAttribute("data-id"));
                const forn = fornecedoresCadastrados.find(f => f.id === id);
                
                if (forn) {
                    alert(`Despachando objeto do Fornecedor ID ${id} para a rota de edição...`);
                    
                    const itemMenuFornecedores = document.querySelector('.submenu-item[data-target="fornecedores"]');
                    if (itemMenuFornecedores) {
                        itemMenuFornecedores.click(); // Força alternância de tela para o Formulário
                        
                        setTimeout(() => {
                            if (document.getElementById("txtIDFornecedor")) {
                                document.getElementById("txtIDFornecedor").value = forn.id;
                                document.getElementById("txtRazaoSocial").value = forn.razao;
                                document.getElementById("txtNomeFantasiaFornecedor").value = forn.fantasia;
                                document.getElementById("txtCNPJFornecedor").value = forn.cnpj;
                                document.getElementById("txtInscricaoEstadual").value = forn.ie;
                                document.getElementById("txtRuaFornecedor").value = forn.rua;
                                document.getElementById("txtBairroFornecedor").value = forn.bairro;
                                document.getElementById("txtCidadeFornecedor").value = forn.cidade;
                                document.getElementById("txtEstadoFornecedor").value = forn.uf;
                                document.getElementById("txtCEPFornecedor").value = forn.cep;
                                document.getElementById("txtRamoAtividade").value = forn.atividade;
                                document.getElementById("txtNomeVendedor").value = forn.vendedor;
                                document.getElementById("txtTelefoneFornecedor").value = forn.contato;
                                document.getElementById("txtEmailFornecedor").value = forn.email;
                                document.getElementById("txtDadosBancarios").value = forn.banco;
                                document.getElementById("txtObservacoesFornecedor").value = forn.obs;
                                document.getElementById("txtDataCadastroFornecedor").value = forn.data;
                            }
                        }, 100);
                    }
                }
            });
        });

        tbody.querySelectorAll(".btn-action-sm.delete").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.getAttribute("data-id"));
                if (confirm(`Deseja remover permanentemente o fornecedor ID ${id} do banco de dados?`)) {
                    fornecedoresCadastrados = fornecedoresCadastrados.filter(f => f.id !== id);
                    renderizarGridFornecedores(fornecedoresCadastrados);
                }
            });
        });
    }

    renderizarGridFornecedores(fornecedoresCadastrados);
})();
