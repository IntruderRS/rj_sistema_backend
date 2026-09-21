(function() {
    const form = document.getElementById("formCategoria");
    if (!form) return;

    const txtIDCategoria = document.getElementById("txtIDCategoria");
    const txtNomeCategoria = document.getElementById("txtNomeCategoria");
    const btnLimpar = document.getElementById("btnLimparCategoria");
    const tbody = document.getElementById("tbodyCategorias");

    const API_URL = "http://localhost:8080/api/categorias";

    // 1. CONSULTA (GET): Busca os dados reais gravados no MySQL
    function carregarCategoriasDoBanco() {
        fetch(API_URL)
            .then(response => {
                if (!response.ok) throw new Error("Falha ao consultar catálogo de categorias.");
                return response.json();
            })
            .then(categorias => {
                tbody.innerHTML = ""; // Limpa a grade visual
                
                if (categorias.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: #94a3b8; padding: 20px;">Nenhuma categoria registrada no banco de dados.</td></tr>`;
                    return;
                }

                categorias.forEach(cat => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td><strong>${cat.id}</strong></td>
                        <td>${cat.nome}</td>
                        <td style="text-align: center;">
                            <button type="button" class="btn-action-sm edit" data-id="${cat.id}"><i class="fa-solid fa-pen"></i></button>
                            <button type="button" class="btn-action-sm delete" data-id="${cat.id}"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
                configurarEventosDoGrid(categorias);
            })
            .catch(error => alert("Erro operacional de rede: " + error.message));
    }

    // 2. INTERCEPTAÇÃO DE AÇÕES (EDITAR / DELETAR VIA API)
    function configurarEventosDoGrid(listaCategorias) {
        // Ação do Botão Editar (Carrega de volta para os inputs)
        tbody.querySelectorAll(".btn-action-sm.edit").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.getAttribute("data-id"));
                const item = listaCategorias.find(c => c.id === id);
                if (item) {
                    txtIDCategoria.value = item.id;
                    txtNomeCategoria.value = item.nome;
                    txtNomeCategoria.focus();
                }
            });
        });

        // Ação do Botão Excluir (Dispara requisição DELETE real para o Spring)
        tbody.querySelectorAll(".btn-action-sm.delete").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                if (confirm(`Deseja realmente remover permanentemente a categoria ID ${id} do banco de dados?`)) {
                    fetch(`${API_URL}/${id}`, { method: "DELETE" })
                        .then(response => {
                            if (!response.ok) throw new Error("O servidor recusou a exclusão.");
                            alert("Registro removido com sucesso do MySQL!");
                            carregarCategoriasDoBanco(); // Recarrega o grid na hora
                        })
                        .catch(error => alert("Erro ao deletar: " + error.message));
                }
            });
        });
    }

    // Caixa alta automática
    txtNomeCategoria.addEventListener("input", () => {
        txtNomeCategoria.value = txtNomeCategoria.value.toUpperCase();
    });

    // 3. PERSISTÊNCIA (POST): Grava ou atualiza no banco
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const categoriaObjeto = {
            id: txtIDCategoria.value ? parseInt(txtIDCategoria.value) : null,
            nome: txtNomeCategoria.value.trim()
        };

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(categoriaObjeto)
        })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao gravar dados no servidor.");
            return response.json();
        })
        .then(() => {
            alert("Operação realizada com sucesso absoluto no banco!");
            limparFormulario();
            carregarCategoriasDoBanco(); // Sincroniza o grid dinamicamente
        })
        .catch(error => alert("Erro de persistência: " + error.message));
    });

    function limparFormulario() {
        form.reset();
        txtIDCategoria.value = "";
        txtNomeCategoria.focus();
    }

    btnLimpar.addEventListener("click", limparFormulario);

    // Carrega a listagem do banco assim que a tela abre
    carregarCategoriasDoBanco();
})();
