// 1. FUNÇÃO GLOBAL: Salvar ou Atualizar Fornecedor via API Spring Boot
function salvarFornecedorWeb(event) {
    event.preventDefault(); // Impede o refresh padrão do navegador

    const API_URL = "http://localhost:8080/api/fornecedores";
    const idInput = document.getElementById("txtIDFornecedor").value;

    const fornecedorObjeto = {
        id: idInput ? parseInt(idInput) : null,
        nomeRazao: document.getElementById("txtRazaoSocial").value.trim(),
        nomeFantasia: document.getElementById("txtNomeFantasiaFornecedor").value.trim(),
        cnpj: document.getElementById("txtCNPJFornecedor").value.trim(),
        ie: document.getElementById("txtInscricaoEstadual").value.trim(),
        rua: document.getElementById("txtRuaFornecedor").value.trim(),
        bairro: document.getElementById("txtBairroFornecedor").value.trim(),
        cidade: document.getElementById("txtCidadeFornecedor").value.trim(),
        estado: document.getElementById("txtEstadoFornecedor").value.toUpperCase().trim(),
        cep: document.getElementById("txtCEPFornecedor").value.trim(),
        atividade: document.getElementById("txtRamoAtividade").value.trim(),
        vendedor: document.getElementById("txtNomeVendedor").value.trim(),
        contato: document.getElementById("txtTelefoneFornecedor").value.trim(),
        email: document.getElementById("txtEmailFornecedor").value.trim(),
        dadosBanco: document.getElementById("txtDadosBancarios").value.trim(),
        observacoes: document.getElementById("txtObservacoesFornecedor").value.trim(),
        dataCadastro: document.getElementById("txtDataCadastroFornecedor").value || null
    };

    // Dispara a requisição HTTP POST transmitindo o objeto estruturado
    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fornecedorObjeto)
    })
    .then(async response => {
        if (!response.ok) {
            const mensagemErro = await response.text();
            throw new Error(mensagemErro || "Erro ao gravar dados da distribuidora.");
        }
        return response.json();
    })
    .then(dadosSalvos => {
        alert(`Sucesso absoluto!\nO fornecedor "${dadosSalvos.nomeRazao}" foi registrado com sucesso sob a chave ID ${dadosSalvos.id}.`);
        limparCamposFornecedorWeb();
    })
    .catch(error => alert("Alerta de Validação: " + error.message));
}

// 2. FUNÇÃO GLOBAL: Limpar Campos e Reinjetar a Data Atual de Auditoria
function limparCamposFornecedorWeb() {
    const form = document.getElementById("formFornecedor");
    if (form) {
        form.reset();
        document.getElementById("txtIDFornecedor").value = "";
        preencherDataAtualAuditoria();
        document.getElementById("txtRazaoSocial").focus();
    }
}

// 3. FUNÇÃO GLOBAL: Injetar a Data Civil na Abertura ou Reinício da Tela
function preencherDataAtualAuditoria() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    const txtData = document.getElementById("txtDataCadastroFornecedor");
    if (txtData) txtData.value = `${ano}-${mes}-${dia}`;
}

// 4. FUNÇÃO GLOBAL: Buscar Rápido via Caixa de Diálogo
function buscarFornecedorWeb() {
    const idBusca = prompt("Insira o ID de consulta do Fornecedor:");
    if (!idBusca || isNaN(idBusca)) {
        if (idBusca) alert("O ID de pesquisa fornecido precisa ser estritamente numérico.");
        return;
    }

    fetch("http://localhost:8080/api/fornecedores")
        .then(res => res.json())
        .then(lista => {
            const forn = lista.find(f => f.id === parseInt(idBusca));
            if (!forn) {
                alert(`Nenhuma distribuidora localizada com a chave ID ${idBusca}.`);
                return;
            }

            // Hidratação instantânea dos inputs com dados vindos do banco Java
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

            alert(`Ficha cadastral da distribuidora ID ${forn.id} recuperada do MySQL com sucesso!`);
        })
        .catch(err => alert("Erro operacional de rede: " + err.message));
}

// Inicia a data automática assim que o arquivo é lido na injeção da tela
setTimeout(preencherDataAtualAuditoria, 100);
