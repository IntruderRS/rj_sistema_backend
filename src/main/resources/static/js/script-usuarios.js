(function() {
    const form = document.getElementById("formUsuario");
    if (!form) return;

    const txtID = document.getElementById("txtIDUsuario");
    const txtNome = document.getElementById("txtNomeUsuario");
    const txtLogin = document.getElementById("txtLoginUsuario");
    const cbTipo = document.getElementById("cbTipoUsuario");
    const txtSenha = document.getElementById("txtSenhaUsuario");
    const txtSenhaRepetida = document.getElementById("txtSenhaRepetidaUsuario");
    const chkRevelar = document.getElementById("chkRevelarSenha");
    const btnLimpar = document.getElementById("btnLimparUsuario");
    const tbody = document.getElementById("tbodyUsuarios");

    // Checkboxes das permissões
    const chkCadastros = document.getElementById("chkCadastros");
    const chkRelatorios = document.getElementById("chkRelatorios");
    const chkPedidos = document.getElementById("chkPedidos");
    const chkAdmin = document.getElementById("chkAdmin");

    const API_URL = "http://localhost:8080/api/usuarios";

    // 1. CONSULTA (GET): Lista os operadores reais gravados no MySQL
    function carregarUsuariosDoBanco() {
        fetch(API_URL)
            .then(res => {
                if (!res.ok) throw new Error("Erro ao obter lista de operadores.");
                return res.json();
            })
            .then(usuarios => {
                tbody.innerHTML = "";
                
                usuarios.forEach(user => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td><strong>${user.id}</strong></td>
                        <td>${user.nome}</td>
                        <td><code>${user.login}</code></td>
                        <td><span class="kpi-info" style="font-size:12px; font-weight:600; color:#0284c7;">${user.tipoPerfil}</span></td>
                        <td style="text-align: center;">
                            <button type="button" class="btn-action-sm edit" data-id="${user.id}"><i class="fa-solid fa-user-gear"></i></button>
                            <button type="button" class="btn-action-sm delete" data-id="${user.id}"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
                configurarEventosDoGrid(usuarios);
            })
            .catch(err => alert("Erro de comunicação: " + err.message));
    }

    // 2. INTERCEPTAÇÃO DE AÇÕES (EDITAR / EXCLUIR VIA SPRING REST)
    function configurarEventosDoGrid(listaUsuarios) {
        // Ação de Editar (Hidrata o formulário e marca os privilégios reais)
        tbody.querySelectorAll(".btn-action-sm.edit").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.getAttribute("data-id"));
                const user = listaUsuarios.find(u => u.id === id);
                if (user) {
                    txtID.value = user.id;
                    txtNome.value = user.nome;
                    txtLogin.value = user.login;
                    cbTipo.value = user.tipoPerfil;
                    
                    // Insere asteriscos de segurança visual
                    txtSenha.value = "******";
                    txtSenhaRepetida.value = "******";

                    // Sincroniza a coleção ManyToMany reativando as caixas marcadas no banco
                    chkCadastros.checked = user.roles.includes("ROLE_CADASTROS");
                    chkRelatorios.checked = user.roles.includes("ROLE_RELATORIOS");
                    chkPedidos.checked = user.roles.includes("ROLE_PEDIDOS");
                    chkAdmin.checked = user.roles.includes("ROLE_ADMIN");
                    
                    txtNome.focus();
                }
            });
        });

        // Ação de Excluir
        tbody.querySelectorAll(".btn-action-sm.delete").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                if (confirm(`Deseja revogar o acesso e deletar permanentemente o operador ID ${id}?`)) {
                    fetch(`${API_URL}/${id}`, { method: "DELETE" })
                        .then(async res => {
                            if (!res.ok) {
                                const msg = await res.text();
                                throw new Error(msg || "A exclusão foi rejeitada.");
                            }
                            alert("Acesso removido com sucesso no banco MySQL!");
                            carregarUsuariosDoBanco();
                        })
                        .catch(err => alert("Erro de Segurança: " + err.message));
                }
            });
        });
    }

    // Limpeza inteligente ao ganhar foco
    txtSenha.addEventListener("focus", () => { if(txtSenha.value === "******") txtSenha.value = ""; });
    txtSenhaRepetida.addEventListener("focus", () => { if(txtSenhaRepetida.value === "******") txtSenhaRepetida.value = ""; });

    // Alternar máscara (Olhinho)
    chkRevelar.addEventListener("change", () => {
        const type = chkRevelar.checked ? "text" : "password";
        txtSenha.type = type;
        txtSenhaRepetida.type = type;
    });

    // 3. PERSISTÊNCIA (POST): Envia o payload completo com a coleção de Roles
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const s1 = txtSenha.value;
        const s2 = txtSenhaRepetida.value;

        if (s1 !== s2) {
            alert("Erro de Segurança: As senhas inseridas não coincidem!");
            txtSenhaRepetida.focus();
            return;
        }

        // Coleta as permissões assinaladas na tela para montar a tabela associativa
        const rolesColetadas = [];
        if (chkCadastros.checked) rolesColetadas.push("ROLE_CADASTROS");
        if (chkRelatorios.checked) rolesColetadas.push("ROLE_RELATORIOS");
        if (chkPedidos.checked) rolesColetadas.push("ROLE_PEDIDOS");
        if (chkAdmin.checked) rolesColetadas.push("ROLE_ADMIN");

        const usuarioObjeto = {
            id: txtID.value ? parseInt(txtID.value) : null,
            nome: txtNome.value.trim(),
            login: txtLogin.value.trim(),
            tipoPerfil: cbTipo.value,
            senha: s1,
            roles: rolesColetadas
        };

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuarioObjeto)
        })
        .then(async response => {
            if (!response.ok) {
                const msg = await response.text();
                throw new Error(msg || "Erro ao processar cadastro.");
            }
            return response.json();
        })
        .then(dadosSalvos => {
            alert(`Sucesso absoluto!\nUsuário "${dadosSalvos.login}" gravado e protegido com Hash SHA-256 no banco MySQL.`);
            limparTelaCompleta();
        })
        .catch(err => alert("Alerta da API: " + err.message));
    });

    function limparTelaCompleta() {
        form.reset();
        txtID.value = "";
        txtSenha.type = "password";
        txtSenhaRepetida.type = "password";
        chkRevelar.checked = false;
        carregarUsuariosDoBanco(); // Atualiza o grid em tempo real
        txtNome.focus();
    }

    btnLimpar.addEventListener("click", limparTelaCompleta);

    // Inicializa a tabela na carga da página
    carregarUsuariosDoBanco();
})();
