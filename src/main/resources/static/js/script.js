function salvarClienteWeb(event) {
    event.preventDefault();

    const API_URL = "http://localhost:8080/api/clientes";
    const idInput = document.getElementById("txtID").value;

    const clienteObjeto = {
        id: idInput ? parseInt(idInput) : null,
        nomeRazao: document.getElementById("txtRazaoSocialNome").value.trim(),
        nomeFantasia: document.getElementById("txtNomeFantasia").value.trim(),
        cnpjCpf: document.getElementById("txtCNPJCPF").value.trim(),
        dataNascimento: document.getElementById("txtNascimento").value || null,
        profissaoAtividade: document.getElementById("txtProfissaoAtividade").value.trim(), 
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

    // Envia o JSON estruturado via método POST para o Spring Boot
    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clienteObjeto)
    })
    .then(async response => {
        if (!response.ok) {
            const mensagemErro = await response.text();
            throw new Error(mensagemErro || "Erro ao salvar registro.");
        }
        return response.json();
    })
    .then(dadosSalvos => {
        alert(`Sucesso absoluto!\nO cliente "${dadosSalvos.nomeRazao}" foi gravado com a chave física ID ${dadosSalvos.id} no banco MySQL.`);
        limparCamposClienteWeb();
    })
    .catch(error => alert("Alerta de Validação: " + error.message));
}

function limparCamposClienteWeb() {
    const form = document.getElementById("formCliente");
    if (form) {
        form.reset();
        document.getElementById("txtID").value = "";
        document.getElementById("txtRazaoSocialNome").focus();
    }
}

function buscarClienteWeb() {
    const idBusca = prompt("Insira o ID de consulta do Cliente:");
    if (!idBusca || isNaN(idBusca)) {
        if (idBusca) alert("O ID fornecido deve possuir apenas caracteres numéricos.");
        return;
    }

    // Busca reativa direto no endpoint individual do JPA
    fetch(`http://localhost:8080/api/clientes`)
        .then(response => response.json())
        .then(lista => {
            const cliente = lista.find(c => c.id === parseInt(idBusca));
            if (!cliente) {
                alert(`Nenhum cliente localizado com a chave ID ${idBusca}.`);
                return;
            }
            
            // Hidrata as caixas de texto com as informações reais vindas das tabelas
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
            
            alert(`Ficha cadastral do ID ${cliente.id} recuperada e carregada na tela!`);
        })
        .catch(err => alert("Erro ao conectar ao servidor: " + err.message));
}
