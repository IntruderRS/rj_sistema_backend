(function () {
    const tbody = document.getElementById("tbodyListaClientes");
    const txtFiltro = document.getElementById("txtFiltroCliente");
    if (!tbody) return;

    // Carga de dados históricos simulados baseados no banco de dados
    let clientesCadastrados = [
        { id: 1, nome: "ALFA TRANSPORTES LTDA", fantasia: "ALFA LOG", documento: "12.345.678/0001-99", nascimento: "1998-05-12", atividade: "Logística", rua: "Av das Nações, 1500", bairro: "Distrito", cidade: "Porto Alegre", uf: "RS", cep: "90000-000", telefone: "(51) 3322-1100", whatsapp: "(51) 99988-7766", email: "contato@alfalog.com.br", obs: "Cliente VIP, faturamento quinzenal." },
        { id: 2, nome: "MECÂNICA DO GORDO LTDA", fantasia: "OFICINA DO GORDO", documento: "98.765.432/0001-11", nascimento: "2010-10-22", atividade: "Oficina Automotiva", rua: "Rua Ceará, 420", bairro: "Centro", cidade: "Camaquã", uf: "RS", cep: "96180-000", telefone: "(51) 3671-2020", whatsapp: "(51) 98877-6655", email: "gordo@mecanica.com", obs: "Comprador assíduo de lubrificantes e filtros." },
        { id: 3, nome: "CHRISTIAN DE SOUZA SILVA", fantasia: "CHRIS AUTO PECAS", documento: "012.345.678-90", nascimento: "1995-03-15", atividade: "Autônomo", rua: "Av Sete de Setembro, 88", bairro: "Vila Nova", cidade: "Porto Alegre", uf: "RS", cep: "91000-000", telefone: "(51) 3211-9090", whatsapp: "(51) 97766-5544", email: "christian@auto.com", obs: "Acesso liberado para faturamento sob encomenda." }
    ];

    // FUNÇÃO QUE DESENHA O GRID VISUAL
    function renderizarGridClientes(listaParaExibir) {
        tbody.innerHTML = "";

        if (listaParaExibir.length === 0) {
            tbody.innerHTML = `<tr><td colspan="16" style="text-align: center; color: #94a3b8; padding: 30px;">Nenhum cliente encontrado com os filtros informados.</td></tr>`;
            return;
        }

        listaParaExibir.forEach(c => {
            const tr = document.createElement("tr");

            // Converte a data ISO do input para o formato visual brasileiro
            let dataFormatada = "";
            if (c.nascimento) {
                const partes = c.nascimento.split("-");
                if (partes.length === 3) dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
            }

            tr.innerHTML = `
                <td style="font-weight: bold; text-align: center;">${c.id}</td>
                <td style="font-weight: 600; white-space: nowrap;">${c.nome}</td>
                <td style="white-space: nowrap;">${c.fantasia || "-"}</td>
                <td><code>${c.documento}</code></td>
                <td>${dataFormatada}</td>
                <td>${c.atividade || "-"}</td>
                <td style="white-space: nowrap;">${c.rua || "-"}</td>
                <td>${c.bairro || "-"}</td>
                <td>${c.cidade || "-"}</td>
                <td style="text-align: center;"><strong>${c.uf || "-"}</strong></td>
                <td>${c.cep || "-"}</td>
                <td>${c.telefone || "-"}</td>
                <td>${c.whatsapp || "-"}</td>
                <td><a href="mailto:${c.email}" style="color:#0284c7; text-decoration:none;">${c.email || "-"}</a></td>
                <td style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${c.obs}">${c.obs || "-"}</td>
                <td style="text-align: center;">
                    <button type="button" class="btn-action-sm edit" data-id="${c.id}" title="Editar Cadastro"><i class="fa-solid fa-user-pen"></i></button>
                    <button type="button" class="btn-action-sm delete" data-id="${c.id}" title="Excluir Permanentemente"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        configurarEventosGrid();
    }

    // PESQUISA EM TEMPO REAL (UPGRADE WEB): Filtra conforme o operador digita (sem precisar de cliques)
    txtFiltro.addEventListener("input", () => {
        const termo = txtFiltro.value.toLowerCase().trim();
        const filtrados = clientesCadastrados.filter(c =>
            c.nome.toLowerCase().includes(termo) ||
            c.documento.includes(termo) ||
            c.cidade.toLowerCase().includes(termo)
        );
        renderizarGridClientes(filtrados);
    });

    // CONFIGURAÇÃO DAS AÇÕES DOS BOTÕES (SRP)
    function configurarEventosGrid() {
        // Ação de Editar (Redireciona para o formulário de cadastros injetando o objeto)
        tbody.querySelectorAll(".btn-action-sm.edit").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.getAttribute("data-id"));
                const cliente = clientesCadastrados.find(c => c.id === id);

                if (cliente) {
                    alert(`Simulação SOLID: Despachando objeto do Cliente ID ${id} para a rota de Edição...`);

                    // Simula a alternância de rota visual acionando o clique do menu lateral de cadastros
                    const itemMenuCadastro = document.querySelector('.submenu-item[data-target="clientes"]');
                    if (itemMenuCadastro) {
                        itemMenuCadastro.click(); // Força a abertura da tela de Cadastro

                        // Alimenta o formulário de cadastro após a renderização dele na tela
                        setTimeout(() => {
                            if (document.getElementById("txtID")) {
                                document.getElementById("txtID").value = cliente.id;
                                document.getElementById("txtRazaoSocialNome").value = cliente.nome;
                                document.getElementById("txtNomeFantasia").value = cliente.fantasia;
                                document.getElementById("txtCNPJCPF").value = cliente.documento;
                                document.getElementById("txtNascimento").value = cliente.nascimento;
                                document.getElementById("txtProfissaoAtividade").value = cliente.atividade;
                                document.getElementById("txtRua").value = cliente.rua;
                                document.getElementById("txtBairro").value = cliente.bairro;
                                document.getElementById("txtCidade").value = cliente.cidade;
                                document.getElementById("txtEstado").value = cliente.uf;
                                document.getElementById("txtCEP").value = cliente.cep;
                                document.getElementById("txtTelefoneContato").value = cliente.telefone;
                                document.getElementById("txtWhatsapp").value = cliente.whatsapp;
                                document.getElementById("txtEmail").value = cliente.email;
                                document.getElementById("txtObservacao").value = cliente.obs;
                            }
                        }, 100);
                    }
                }
            });
        });

        // Ação de Excluir
        tbody.querySelectorAll(".btn-action-sm.delete").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.getAttribute("data-id"));
                if (confirm(`Tem certeza que deseja remover permanentemente o cliente ID ${id} do banco de dados MySQL?`)) {
                    clientesCadastrados = clientesCadastrados.filter(c => c.id !== id);
                    renderizarGridClientes(clientesCadastrados); // Atualiza a tabela visual na hora
                }
            });
        });
    }

    // Inicializa a tabela ao abrir o componente
    renderizarGridClientes(clientesCadastrados);
})();
