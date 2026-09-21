(function () {
    const formDados = document.getElementById("formMeusDados");
    const formSenha = document.getElementById("formTrocarSenha");
    if (!formDados && !formSenha) return;

    // Elementos de Tema
    const btnLight = document.getElementById("btnThemeLight");
    const btnDark = document.getElementById("btnThemeDark");

    // 1. ALTERAÇÃO DO NOME DO OPERADOR LOGADO
    if (formDados) {
        formDados.addEventListener("submit", (e) => {
            e.preventDefault();
            const novoNome = document.getElementById("txtMyNome").value.trim();

            // Sincroniza em tempo real o nome no painel da esquerda do Christian
            const labelNomeMenu = document.querySelector(".user-name");
            if (labelNomeMenu) labelNomeMenu.innerText = novoNome.split(" ")[0];

            alert(`Dados atualizados com sucesso!\nNome alterado para: ${novoNome}`);
        });
    }

    // 2. ALTERAÇÃO DA SENHA (VALIDAÇÃO EM TRÊS CAMPOS)
    if (formSenha) {
        formSenha.addEventListener("submit", (e) => {
            e.preventDefault();
            const atual = document.getElementById("txtSenhaAtual").value;
            const nova = document.getElementById("txtNovaSenha").value;
            const confirma = document.getElementById("txtNovaSenhaRepetida").value;

            if (nova !== confirma) {
                alert("Erro de Segurança: A nova senha e a confirmação não coincidem!");
                document.getElementById("txtNovaSenhaRepetida").focus();
                return;
            }

            if (nova.length < 4) {
                alert("A nova senha deve possuir uma combinação mais segura.");
                return;
            }

            alert("Senha alterada com sucesso!");
            formSenha.reset();
        });
    }

    // 3. MECANISMO DE ALTERAÇÃO DE TEMA (LIGHT / DARK)
    if (btnLight && btnDark) {
        btnLight.addEventListener("click", () => {
            // Remove a classe escura do corpo do site, voltando tudo para o Modo Claro
            document.body.classList.remove("dark-theme");
            alert("Interface redefinida para o Modo Claro.");
        });

        btnDark.addEventListener("click", () => {
            // Adiciona a classe escura no corpo do site, ativando o estilo automático do CSS
            document.body.classList.add("dark-theme");
            alert("Interface redefinida para o Modo Escuro (Dark Mode).");
        });
    }
})();
