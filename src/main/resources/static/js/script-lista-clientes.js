(function() {
    const tbody = document.getElementById("tbodyListaClientes");
    const txtFiltro = document.getElementById("txtFiltroCliente");
    if (!tbody) return;

    const API_URL = "http://localhost:8080/api/clientes";
    let cacheClientes = []; // Armazena a resposta em memória para o filtro reativo funcionar instantaneamente

    function carregarRelatorioClientes() {
        fetch(API_URL)
            .then(res => res.json())
            .then(dados => {
                cacheClientes = dados;
                renderizarGradeDeDados(cacheClientes);
            })
            .catch(err => alert("Erro ao ler dados da API: " + err.message));
    }

    function renderizarGradeDeDados(lista) {
        tbody.innerHTML = "";

        if (lista.length === 0) {
            tbody.innerHTML = `<tr><td colspan="16" style="text-align: center; color: #94a3b8; padding: 30px;">Nenhum registro localizado no arquivo do banco de dados.</td></tr>`;
            return;
        }

        lista.forEach(c => {
            let dataFormatada = "-";
            if (c.dataNascimento) {
                dataFormatada = c.dataNascimento.split("-").reverse().join("/");
            }

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="font-weight: bold; text-align: center;">${c.id}</td>
                <td style="font-weight: 600; white-space: nowrap;">${c.nomeRazao}</td>
                <td>${c.nomeFantasia || "-"}</td>
                <td><code>${c.cnpjCpf}</code></td>
                <td style="text-align: center;">${dataFormatada}</td>
                <td>${c.profissaoAtividade || "-"}</td>
                <td style="white-space: nowrap;">${c.rua || "-"}</td>
                <td>${c.bairro || "-"}</td>
                <td>${c.cidade || "-"}</td>
                <td style="text-align: center;"><strong>${c.estado || "-"}</strong></td>
                <td>${c.cep || "-"}</td>
                <td>${c.telefone || "-"}</td>
                <td>${c.whatsapp || "-"}</td>
                <td><a href="mailto:${c.email}" style="color:#0284c7; text-decoration:none;">${c.email || "-"}</a></td>
                <td style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${c.observacao}">${c.observacao || "-"}</td>
                <td style="text-align: center;">
                    <button type="button" class="btn-action-sm edit" data-id="${c.id}" title="Editar Cadastro"><i class="fa-solid fa-user-pen"></i></button>
                    <button type="button" class="btn-action-sm delete" data-id="${c.id}" title="Excluir Permanentemente"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        configurarAcoesDoGrid();
    }

    // Filtro instantâneo em tempo real
    txtFiltro.addEventListener("input", () => {
        const termo = txtFiltro.value.toLowerCase().trim();
        const filtrados = cacheClientes.filter(c => 
            c.nomeRazao.toLowerCase().includes(termo) || 
            c.cnpjCpf.includes(termo) || 
            c.cidade.toLowerCase().includes(termo)
        );
        renderizarGradeDeDados(filtrados);
    });

    function configurarAcoesDoGrid() {
        // Ação de Deletar Registro via API REST do Spring
        tbody.querySelectorAll(".btn-action-sm.delete").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                if (confirm(`Tem certeza que deseja apagar o cliente de chave ID ${id} diretamente das tabelas do MySQL?`)) {
                    fetch(`${API_URL}/${id}`, { method: "DELETE" })
                        .then(res => {
                            if (!res.ok) throw new Error("A API recusou o comando de remoção.");
                            alert("Cliente excluído com sucesso!");
                            carregarRelatorioClientes();
                        })
                        .catch(err => alert("Erro ao excluir: " + err.message));
                }
            });
        });

        // Ação de Editar (Volta para o formulário e injeta)
        tbody.querySelectorAll(".btn-action-sm.edit").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.getAttribute("data-id"));
                const cliente = cacheClientes.find(c => c.id === id);
                if (cliente) {
                    const itemMenu = document.querySelector('.submenu-item[data-target="clientes"]');
                    if (itemMenu) {
                        itemMenu.click(); // Redireciona visualmente
                        setTimeout(() => {
                            document.getElementById("txtID").value = cliente.id;
                            document.getElementById("txtRazaoSocialNome").value = cliente.nomeRazao;
                            document.getElementById("txtNomeFantasia").value = cliente.nomeFantasia || "";
                            document.getElementById("txtCNPJCPF").value = cliente.cnpjCpf;
                            document.getElementById("txtNascimento").value = cliente.dataNascimento || "";
                            document.getElementById("txtProfissaoAtividade").value = cliente.profissaoAtividade || "";
                            document.getElementById("txtRua").value = cliente.rua || "";
                            document.getElementById("txtBairro").value = cliente.bairro || "";
                            document.getElementById("txtCidade").value = cliente.cidade || "";
                            document.getElementById("txtEstado").value = cliente.estado || "";
                            document.getElementById("txtCEP").value = cliente.cep || "";
                            document.getElementById("txtTelefoneContato").value = cliente.telefone || "";
                            document.getElementById("txtWhatsapp").value = cliente.whatsapp || "";
                            document.getElementById("txtEmail").value = cliente.email || "";
                            document.getElementById("txtObservacao").value = cliente.observacao || "";
                        }, 150);
                    }
                }
            });
        });
    }

    carregarRelatorioClientes();
})();
