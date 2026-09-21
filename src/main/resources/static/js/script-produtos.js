// 1. FUNÇÃO GLOBAL: Carrega Categorias e Fornecedores Reais nas Caixas de Seleção do Formulário
function inicializarDropdownsAuxiliares() {
    const cbCategoria = document.getElementById("cbCategoriaProduto");
    const cbFornecedor = document.getElementById("cbFornecedorProduto");

    if (!cbCategoria || !cbFornecedor) return;

    // Busca Categorias Reais do MySQL
    fetch("http://localhost:8080/api/categorias")
        .then(res => res.json())
        .then(categorias => {
            cbCategoria.innerHTML = '<option value="" disabled selected>Selecione uma Categoria</option>';
            categorias.forEach(cat => {
                cbCategoria.innerHTML += `<option value="${cat.id}">${cat.nome}</option>`;
            });
        })
        .catch(err => console.error("Erro ao carregar combo de categorias:", err));

    // Busca Fornecedores Reais do MySQL
    fetch("http://localhost:8080/api/fornecedores")
        .then(res => res.json())
        .then(fornecedores => {
            cbFornecedor.innerHTML = '<option value="" disabled selected>Selecione um Fornecedor</option>';
            fornecedores.forEach(forn => {
                cbFornecedor.innerHTML += `<option value="${forn.id}">${forn.nomeRazao}</option>`;
            });
        })
        .catch(err => console.error("Erro ao carregar combo de fornecedores:", err));
}

// 2. FUNÇÃO GLOBAL: Salvar ou Editar Produto na REST API
function salvarProdutoWeb(event) {
    event.preventDefault();

    const API_URL = "http://localhost:8080/api/produtos";
    const idInput = document.getElementById("txtIDProduto").value;

    const produtoObjeto = {
        id: idInput ? parseInt(idInput) : null,
        nome: document.getElementById("txtNomeProduto").value.trim(),
        valorCusto: parseFloat(document.getElementById("txtValorCusto").value.replace(",", ".")),
        porcentagemLucro: parseFloat(document.getElementById("txtPorcentagemLucro").value.replace(",", ".")),
        valorVenda: parseFloat(document.getElementById("txtValorVenda").value.replace(",", ".")),
        quantidadeEstoque: parseInt(document.getElementById("txtQuantidadeEstoque").value),
        peso: parseFloat(document.getElementById("txtPeso").value.replace(",", ".")),
        dimensoes: document.getElementById("txtDimensoes").value.trim(),
        codigoBarras: document.getElementById("txtCodigoBarras").value.trim(),
        ncm: document.getElementById("txtNCM").value.trim(),
        lote: document.getElementById("txtLote").value.trim(),
        dataVencimento: document.getElementById("txtVencimento").value || null,
        observacao: document.getElementById("txtObservacaoProduto").value.trim(),
        categoria: { id: parseInt(document.getElementById("cbCategoriaProduto").value) },
        fornecedorId: parseInt(document.getElementById("cbFornecedorProduto").value)
    };

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produtoObjeto)
    })
    .then(response => {
        if (!response.ok) throw new Error("Erro ao gravar produto no catálogo.");
        return response.json();
    })
    .then(dadosSalvos => {
        alert(`Sucesso absoluto!\nO produto "${dadosSalvos.nome}" foi cadastrado com a chave ID ${dadosSalvos.id}.`);
        limparFormularioProdutoWeb();
    })
    .catch(error => alert("Erro de gravação: " + error.message));
}

// 3. FUNÇÃO GLOBAL: Limpar Campos
function limparFormularioProdutoWeb() {
    const form = document.getElementById("formProduto");
    if (form) {
        form.reset();
        document.getElementById("txtIDProduto").value = "";
        document.getElementById("txtNomeProduto").focus();
    }
}

// 4. LÓGICA MATEMÁTICA DE PREÇO REATIVO EM TEMPO REAL
function calcularPrecoVendaAutomatico() {
    const txtValorCusto = document.getElementById("txtValorCusto");
    const txtPorcentagemLucro = document.getElementById("txtPorcentagemLucro");
    const txtValorVenda = document.getElementById("txtValorVenda");

    if (!txtValorCusto || !txtPorcentagemLucro || !txtValorVenda) return;

    const custo = parseFloat(txtValorCusto.value.trim().replace(",", ".")) || 0;
    const lucro = parseFloat(txtPorcentagemLucro.value.trim().replace(",", ".")) || 0;

    if (custo > 0 && lucro > 0) {
        const margem = custo * (lucro / 100);
        const vendaFinal = custo + margem;
        txtValorVenda.value = vendaFinal.toFixed(2).replace(".", ",");
    } else if (custo > 0) {
        txtValorVenda.value = custo.toFixed(2).replace(".", ",");
    } else {
        txtValorVenda.value = "";
    }
}

// Configura os ouvintes de entrada para o cálculo matemático reativo
document.addEventListener("input", (e) => {
    if (e.target.id === "txtValorCusto" || e.target.id === "txtPorcentagemLucro") {
        calcularPrecoVendaAutomatico();
    }
});

// Inicializa a carga dos dropdowns reais na abertura da visão
setTimeout(inicializarDropdownsAuxiliares, 100);
