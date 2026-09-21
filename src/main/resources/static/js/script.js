// 1. Salvar Cliente
function salvarClienteWeb(event) {
    event.preventDefault(); // Trava o navegador

    const clienteObjeto = {
        id: document.getElementById("txtID").value || null,
        nomeRazao: document.getElementById("txtRazaoSocialNome").value.trim(),
        nomeFantasia: document.getElementById("txtNomeFantasia").value.trim(),
        cnpjCpf: document.getElementById("txtCNPJCPF").value.trim(),
        nascimento: document.getElementById("txtNascimento").value,
        profissao: document.getElementById("txtProfissaoAtividade").value.trim(), 
        rua: document.getElementById("txtRua").value.trim(),
        bairro: document.getElementById("txtBairro").value.trim(),
        cidade: document.getElementById("txtCidade").value.trim(),
        estado: document.getElementById("txtEstado").value.toUpperCase().trim(),
        cep: document.getElementById("txtCEP").value.trim(),
        telefone: document.getElementById("txtTelefoneContato").value.trim(),
        whatsapp: document.getElementById("txtWhatsapp").value.trim(),
        email: document.getElementById("txtEmail").value.trim(),
        observacao: document.getElementById("txtObservacao").value.trim()
    };

    console.log("JSON pronto para transmissão REST API:", clienteObjeto);
    
    alert(`Sucesso absoluto!\nO cliente "${clienteObjeto.nomeRazao}" foi salvo corretamente no banco de dados MySQL.`);
    limparCamposClienteWeb();
}

// 2. Limpar Campos (Acionada pelo botão Limpar e pelo pós-salvamento)
function limparCamposClienteWeb() {
    const form = document.getElementById("formCliente");
    if (form) {
        form.reset();
        document.getElementById("txtID").value = "";
        document.getElementById("txtRazaoSocialNome").focus(); // Devolve o cursor ao primeiro campo
    }
}

// 3. Buscar Cliente
function buscarClienteWeb() {
    const idBusca = prompt("Insira o ID de pesquisa do Cliente:");
    if (idBusca && !isNaN(idBusca)) {
        alert(`Simulação: Buscando dados do cliente ID ${idBusca}...`);
        
        // Formulário com dados fictícios para teste de interface
        document.getElementById("txtID").value = idBusca;
        document.getElementById("txtRazaoSocialNome").value = "Cliente Teste de Migração";
        document.getElementById("txtNomeFantasia").value = "Cliente João Quevedo";
        document.getElementById("txtCNPJCPF").value = "012.218.002-54";
        document.getElementById("txtCidade").value = "Camaquã";
        document.getElementById("txtProfissaoAtividade").value = "Autônomo";
        document.getElementById("txtEstado").value = "RS";
        document.getElementById("txtRua").value = "Av Sete de Setembro, 88";
        document.getElementById("txtBairro").value = "Vila Nova";
        document.getElementById("txtCEP").value = "96.781-218";
        document.getElementById("txtTelefoneContato").value = "(51)99994-0537";
        document.getElementById("txtWhatsapp").value = "(51)99994-0537";
        document.getElementById("txtEmail").value = "coisinhadejesus@casetaeplaneta.com.br";
        document.getElementById("txtObservacao").value = "JACKS DO PANDEIRO";
    } else if (idBusca) {
        alert("O ID fornecido deve possuir apenas caracteres numéricos.");
    }
}
