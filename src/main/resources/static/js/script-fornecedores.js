(function() {
    const form = document.getElementById("formFornecedor");
    if (!form) return;

    const txtDataCadastro = document.getElementById("txtDataCadastroFornecedor");
    const btnLimpar = document.getElementById("btnLimparFornecedor");
    const btnBuscar = document.getElementById("btnBuscarFornecedor");

    // LÓGICA DE AUDITORIA: Preenche automaticamente com a data atual
    function preencherDataAtual() {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const dia = String(hoje.getDate()).padStart(2, '0');
        txtDataCadastro.value = `${ano}-${mes}-${dia}`;
    }
    
    // Executa a carga automática da data na abertura da tela
    preencherDataAtual();

    // EVENTO DE SUBMIT (SALVAR FORNECEDOR)
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const fornecedorObjeto = {
            id: document.getElementById("txtIDFornecedor").value || null,
            nomeRazao: document.getElementById("txtRazaoSocial").value.trim(),
            nomeFantasia: document.getElementById("txtNomeFantasiaFornecedor").value.trim(),
            cnpj: document.getElementById("txtCNPJFornecedor").value.trim(),
            inscricao: document.getElementById("txtInscricaoEstadual").value.trim(),
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
            dataCadastro: txtDataCadastro.value
        };

        console.log("JSON de Fornecedor pronto para o Backend:", fornecedorObjeto);
        alert(`Fornecedor "${fornecedorObjeto.nomeRazao}" processado com sucesso na interface Web!`);
        form.reset();
        preencherDataAtual();
    });

    btnLimpar.addEventListener("click", () => {
        form.reset();
        preencherDataAtual();
        document.getElementById("txtRazaoSocial").focus();
    });

    btnBuscar.addEventListener("click", () => {
        const idBusca = prompt("Insira o ID de pesquisa do Fornecedor:");
        if (idBusca && !isNaN(idBusca)) {
            alert(`Simulação: Hidratando tela com dados do fornecedor ID ${idBusca}...`);
            document.getElementById("txtIDFornecedor").value = idBusca;
            document.getElementById("txtRazaoSocial").value = "Lubrax Distribuidora de Óleos S/A";
            document.getElementById("txtNomeFantasiaFornecedor").value = "Lubrax";
            document.getElementById("txtCNPJFornecedor").value = "12.345.678/0001-01";
            document.getElementById("txtRuaFornecedor").value = "Presidente Vargas, 5800";
            document.getElementById("txtBairroFornecedor").value = "Bairro Industrial";
            document.getElementById("txtCidadeFornecedor").value = "São Paulo";
            document.getElementById("txtEstadoFornecedor").value = "SP";
            document.getElementById("txtCEPFornecedor").value = "88.340-001";
            document.getElementById("txtRamoAtividade").value = "Fabricante de Óleo e Aditivos";
            document.getElementById("txtTelefoneFornecedor").value = "(011)92305-5800";
            document.getElementById("txtEmailFornecedor").value = "atendimento@lubrax.com.br";
            document.getElementById("txtObservacoesFornecedor").value = "Compras Online sempre 15% Desconto";
        } else if (idBusca) {
            alert("O ID de busca precisa ser numérico.");
        }
    });
})();
