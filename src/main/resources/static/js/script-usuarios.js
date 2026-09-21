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

    // Catálogo simulando o banco de dados MySQL
    let usuariosBanco = [
        { id: 1, nome: "Christian Christian", login: "christian.adm", tipo: "Administrador", roles: ["ROLE_ADMIN"] },
        { id: 2, nome: "Ana Costa", login: "ana.vendas", tipo: "Vendedor", roles: ["ROLE_PEDIDOS"] }
    ];

    function atualizarTabelaUsuarios() {
        tbody.innerHTML = "";
        usuariosBanco.forEach(user => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${user.id}</strong></td>
                <td>${user.nome}</td>
                <td><code>${user.login}</code></td>
                <td><span class="kpi-info" style="font-size:12px; font-weight:600; color:#0284c7;">${user.tipo}</span></td>
                <td style="text-align: center;">
                    <button type="button" class="btn-action-sm edit" data-id="${user.id}"><i class="fa-solid fa-user-gear"></i></button>
                    <button type="button" class="btn-action-sm delete" data-id="${user.id}"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        configurarCliquesTabela();
    }

    function configurarCliquesTabela() {
        // Ação do Botão Editar/Configurar Usuário
        tbody.querySelectorAll(".btn-action-sm.edit").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.getAttribute("data-id"));
                const user = usuariosBanco.find(u => u.id === id);
                if (user) {
                    txtID.value = user.id;
                    txtNome.value = user.nome;
                    txtLogin.value = user.login;
                    cbTipo.value = user.tipo;
                    
                    // Injeta asteriscos fictícios para segurança visual
                    txtSenha.value = "******";
                    txtSenhaRepetida.value = "******";

                    // Reseta e re-marca os checkboxes baseado na coleção @ManyToMany vinda do banco
                    chkCadastros.checked = user.roles.includes("ROLE_CADASTROS");
                    chkRelatorios.checked = user.roles.includes("ROLE_RELATORIOS");
                    chkPedidos.checked = user.roles.includes("ROLE_PEDIDOS");
                    chkAdmin.checked = user.roles.includes("ROLE_ADMIN");
                    
                    txtNome.focus();
                }
            });
        });

        // Ação do Botão Excluir Usuário
        tbody.querySelectorAll(".btn-action-sm.delete").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.getAttribute("data-id"));
                if (id === 1) {
                    alert("Atenção: O usuário administrador principal do sistema não pode ser removido!");
                    return;
                }
                if (confirm(`Deseja revogar o acesso e deletar permanentemente o usuário ID ${id}?`)) {
                    usuariosBanco = usuariosBanco.filter(u => u.id !== id);
                    atualizarTabelaUsuarios();
                }
            });
        });
    }

    // Limpa os inputs de senha ao clicar/ganhar foco para evitar apagar manualmente
    txtSenha.addEventListener("focus", () => txtSenha.value = "");
    txtSenhaRepetida.addEventListener("focus", () => txtSenhaRepetida.value = "");

    // GATILHO DE EXIBIÇÃO: Alterna a máscara de senha (Olhinho)
    chkRevelar.addEventListener("change", () => {
        const type = chkRevelar.checked ? "text" : "password";
        txtSenha.type = type;
        txtSenhaRepetida.type = type;
    });

    // EVENTO DE SUBMIT (SALVAR)
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const s1 = txtSenha.value;
        const s2 = txtSenhaRepetida.value;

        // Regra de Consistência e Igualdade Corporativa (SRP)
        if (s1 !== s2) {
            alert("Validação de Segurança: As senhas inseridas não coincidem!");
            txtSenhaRepetida.focus();
            return;
        }

        const rolesColetadas = [];
        if (chkCadastros.checked) rolesColetadas.push("ROLE_CADASTROS");
        if (chkRelatorios.checked) rolesColetadas.push("ROLE_RELATORIOS");
        if (chkPedidos.checked) rolesColetadas.push("ROLE_PEDIDOS");
        if (chkAdmin.checked) rolesColetadas.push("ROLE_ADMIN");

        if (txtID.value) {
            // Fluxo UPDATE (merge)
            const id = parseInt(txtID.value);
            const index = usuariosBanco.findIndex(u => u.id === id);
            if (index !== -1) {
                usuariosBanco[index].nome = txtNome.value.trim();
                usuariosBanco[index].login = txtLogin.value.trim();
                usuariosBanco[index].tipo = cbTipo.value;
                usuariosBanco[index].roles = rolesColetadas;
            }
            alert("Configurações e privilégios do usuário atualizados com sucesso!");
        } else {
            // Fluxo INSERT (persist) com simulação de HASH criptográfico
            const proximoId = usuariosBanco.length > 0 ? Math.max(...usuariosBanco.map(u => u.id)) + 1 : 1;
            
            // Simulação matemática do Hash hexadecimal
            const senhaHashFicticio = Math.abs(s1.split("").reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)).toString(16);

            usuariosBanco.push({
                id: proximoId,
                nome: txtNome.value.trim(),
                login: txtLogin.value.trim(),
                tipo: cbTipo.value,
                roles: rolesColetadas,
                senhaCripto: senhaHashFicticio
            });
            alert(`Usuário registrado com sucesso!\nSenha mascarada gravada no banco: ${senhaHashFicticio}`);
        }

        limparTelaCompleta();
    });

    function limparTelaCompleta() {
        form.reset();
        txtID.value = "";
        txtSenha.type = "password";
        txtSenhaRepetida.type = "password";
        chkRevelar.checked = false;
        atualizarTabelaUsuarios();
        txtNome.focus();
    }

    btnLimpar.addEventListener("click", limparTelaCompleta);

    // Inicializa o grid na abertura do painel
    atualizarTabelaUsuarios();
})();
