(function() {
    const form = document.getElementById("formCategoria");
    if (!form) return;

    const txtIDCategoria = document.getElementById("txtIDCategoria");
    const txtNomeCategoria = document.getElementById("txtNomeCategoria");
    const btnLimpar = document.getElementById("btnLimparCategoria");
    const tbody = document.getElementById("tbodyCategorias");

    // Simulação do catálogo inicial salvo no banco MySQL
    let categoriasBanco = [
        { id: 1, nome: "LUBRIFICANTES E FLUIDOS" },
        { id: 2, nome: "PNEUS E RODAS" },
        { id: 3, nome: "SISTEMA DE FREIOS" },
        { id: 4, nome: "SUSPENSÃO E AMORTECEDORES" }
    ];

    // FUNÇÃO QUE SIMULA A TABELA DINAMICAMENTE
    function atualizarTabelaCategorias() {
        tbody.innerHTML = ""; // Limpa o grid visual

        categoriasBanco.forEach(cat => {
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

        configurarCliquesAcoesTabela();
    }

    // INTERCEPTA OS BOTÕES DE EDITAR E EXCLUIR DE CADA LINHA (COMPORTAMENTO JTABLE)
    function configurarCliquesAcoesTabela() {
        // Ação do Botão Editar
        tbody.querySelectorAll(".btn-action-sm.edit").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.getAttribute("data-id"));
                const itemencontrado = categoriasBanco.find(c => c.id === id);
                if (itemencontrado) {
                    // Preenche o formulário da esquerda com os dados da linha quando clicada
                    txtIDCategoria.value = itemencontrado.id;
                    txtNomeCategoria.value = itemencontrado.nome;
                    txtNomeCategoria.focus();
                }
            });
        });

        // Ação do Botão Excluir
        tbody.querySelectorAll(".btn-action-sm.delete").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.getAttribute("data-id"));
                const confirmar = confirm(`Deseja realmente remover permanentemente a categoria ID ${id}?`);
                if (confirmar) {
                    categoriasBanco = categoriasBanco.filter(c => c.id !== id);
                    atualizarTabelaCategorias(); // Recarrega o grid visual na hora
                }
            });
        });
    }

    // Converte em letras maiúsculas em tempo de digitação, para ficar sempre padrão
    txtNomeCategoria.addEventListener("input", () => {
        txtNomeCategoria.value = txtNomeCategoria.value.toUpperCase();
    });

    // EVENTO DE SUBMIT (SALVAR / ATUALIZAR)
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nomeValue = txtNomeCategoria.value.trim();

        if (txtIDCategoria.value) {
            // SE JÁ TEM ID: É uma Edição
            const id = parseInt(txtIDCategoria.value);
            const index = categoriasBanco.findIndex(c => c.id === id);
            if (index !== -1) categoriasBanco[index].nome = nomeValue;
            alert("Categoria atualizada com sucesso no banco!");
        } else {
            // SE NÃO TEM ID: É um registro novo
            const proximoId = categoriasBanco.length > 0 ? Math.max(...categoriasBanco.map(c => c.id)) + 1 : 1;
            categoriasBanco.push({ id: proximoId, nome: nomeValue });
            alert("Nova categoria gravada com sucesso!");
        }

        form.reset();
        txtIDCategoria.value = "";
        atualizarTabelaCategorias(); // Sincroniza o grid visual instantaneamente
    });

    btnLimpar.addEventListener("click", () => {
        form.reset();
        txtIDCategoria.value = "";
        txtNomeCategoria.focus();
    });

    // Inicializa a tabela na abertura da tela
    atualizarTabelaCategorias();
})();
