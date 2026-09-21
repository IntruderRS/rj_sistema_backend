document.addEventListener("DOMContentLoaded", () => {
    const txtDataAtual = document.getElementById("txtDataAtual");
    if (txtDataAtual) {
        const hoje = new Date();

        // Formatador regional nativo do JavaScript configurado para extenso em português
        const formatadorData = new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "full"
        });

        // Captura a string (ex: "sexta-feira, 4 de julho de 2026") e ajusta a primeira letra para Maiúscula
        let dataExtenso = formatadorData.format(hoje);
        dataExtenso = dataExtenso.charAt(0).toUpperCase() + dataExtenso.slice(1);

        // Injeta o texto tratado diretamente no cabeçalho fixo do topo
        txtDataAtual.innerText = dataExtenso;
    }

    const btnToggleSidebar = document.getElementById("btn-toggle-sidebar");

    if (btnToggleSidebar) {
        btnToggleSidebar.addEventListener("click", (e) => {
            e.preventDefault();

            const ehTelaPequena = window.innerWidth <= 992;

            if (ehTelaPequena) {
                // Em telas menores, alterna a classe de força mobile
                document.body.classList.toggle("force-expanded-mobile");
                document.body.classList.remove("collapsed");
            } else {
                // Em telas de computador normais, alterna o colapso padrão
                document.body.classList.toggle("collapsed");
                document.body.classList.remove("force-expanded-mobile");
            }

            // Se o menu fechar, recolhe as cascatas abertas automaticamente
            if (document.body.classList.contains("collapsed") || !document.body.classList.contains("force-expanded-mobile") && ehTelaPequena) {
                document.querySelectorAll(".menu-dropdown").forEach(dropdown => {
                    dropdown.classList.remove("open");
                });
            }
        });
    }
    const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
    const menuItems = document.querySelectorAll(".menu-item:not(.dropdown-toggle), .submenu-item");
    const toolbarButtons = document.querySelectorAll(".toolbar-btn:not(.btn-trigger-logout)");
    const logoutButtons = document.querySelectorAll(".btn-trigger-logout");
    const container = document.getElementById("dynamic-container");
    const btnLogoHome = document.getElementById("btnLogoHome");

    const homeView = document.getElementById("home-view");
    const logoView = document.getElementById("logo-view");

    // 1. GERENCIADOR DOS SUBMENUS EM CASCATA
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener("click", (e) => {
            e.preventDefault();
            const parent = toggle.parentElement;

            const ehTelaPequena = window.innerWidth <= 992;
            const estaEncolhido = document.body.classList.contains("collapsed");

            // SE ESTIVER EM TELA PEQUENA OU ENCOLHIDO MANUALMENTE:
            if (estaEncolhido || ehTelaPequena) {
                // CORREÇÃO: Limpa a classe de encolhido e injeta a de expansão móvel
                document.body.classList.remove("collapsed");
                document.body.classList.add("force-expanded-mobile");

                document.querySelectorAll(".menu-dropdown").forEach(item => {
                    if (item !== parent) item.classList.remove("open");
                });

                setTimeout(() => {
                    parent.classList.add("open");
                }, 150);
                return;
            }

            // Comportamento padrão para Desktop Expandido
            const jaEstavaAberto = parent.classList.contains("open");
            document.querySelectorAll(".menu-dropdown").forEach(item => item.classList.remove("open"));

            if (!jaEstavaAberto) {
                parent.classList.add("open");
            }
        });
    });

    // COMPLEMENTO NA ROTA GERAL: Se clicar em uma opção filha, limpa a classe móvel após carregar a tela
    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            if (window.innerWidth <= 992) {
                // Em celulares, após escolher o submenu, o menu volta a ficar fininho de 70px automaticamente
                document.body.classList.remove("force-expanded-mobile");
                document.querySelectorAll(".menu-dropdown").forEach(d => d.classList.remove("open"));
            }
        });
    });

    // 2. CONTROLE DE NAVEGAÇÃO DE ROTAS (MENU LATERAL)
    menuItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();

            // Se o usuário clicar em um link comum (ex: Pedidos) com a barra encolhida, expande na hora
            if (document.body.classList.contains("collapsed")) {
                document.body.classList.remove("collapsed");
            }

            document.querySelectorAll(".menu-item, .submenu-item, .toolbar-btn").forEach(i => {
                i.classList.remove("active", "active-sub");
            });

            if (item.classList.contains("submenu-item")) {
                item.classList.add("active-sub");
                item.closest(".menu-dropdown").querySelector(".menu-item").classList.add("active");
            } else if (item.classList.contains("menu-item")) {
                item.classList.add("active");
            }

            const target = item.getAttribute("data-target");
            direcionarTela(target);
        });
    });

    // 3. CONTROLE DE CLIQUES DOS MINI-BOTÕES DO USUÁRIO (BLOCO ISOLADO E PROTEGIDO)
    toolbarButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();

            // Remove destaques de outras telas
            document.querySelectorAll(".menu-item, .submenu-item").forEach(i => i.classList.remove("active", "active-sub"));

            const target = btn.getAttribute("data-target");
            direcionarTela(target);
        });
    });

    // 4. GATILHO DE LOGOUT / ENCERRAMENTO DE SESSÃO
    logoutButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const confirmar = confirm("Deseja realmente acessar a tela de Login ou trocar de usuário?");
            if (confirmar) {
                alert("Simulação: Limpando credenciais da sessão e redirecionando para a tela de autenticação...");
                direcionarTela("logo");
            }
        });
    });

    // 5. GATILHO DO BOTÃO "RJ SISTEMA" (LOGO CENTRAL)
    btnLogoHome.addEventListener("click", () => {
        document.querySelectorAll(".menu-item, .submenu-item, .toolbar-btn").forEach(i => i.classList.remove("active", "active-sub"));
        direcionarTela("logo");
    });

    function direcionarTela(target) {
        if (!target) return; // Blinda o sistema caso o alvo seja nulo

        // Restaura a visibilidade dos painéis fixos da index
        homeView.style.display = "none";
        logoView.style.display = "none";

        // Remove componentes de telas externas carregadas anteriormente
        const elementosInjetados = container.querySelectorAll(".container, .development-placeholder");
        elementosInjetados.forEach(el => el.remove());

        if (target === "home") {
            homeView.style.display = "block";
        } else if (target === "logo") {
            logoView.style.display = "block";
        } else if (target === "perfil-usuario" || target === "config-sistema" || target === "alterar-senha") {
            //Carrega a página passando o script e ativa a aba correspondente
            carregarTelaDinamica("perfil-usuario.html", "script-perfil.js");

            // Ícones Usuário, exibe o painel correto de forma reativa após a injeção do HTML
            setTimeout(() => {
                const titulo = document.getElementById("lblTituloPerfil");
                const divDados = document.getElementById("panel-dados");
                const divConfig = document.getElementById("panel-config");
                const divSenha = document.getElementById("panel-senha");

                // Esconde todas as abas internas do perfil por segurança
                if (divDados) divDados.style.display = "none";
                if (divConfig) divConfig.style.display = "none";
                if (divSenha) divSenha.style.display = "none";

                if (target === "perfil-usuario" && divDados) {
                    if (titulo) titulo.innerText = "MEUS DADOS CADASTRAIS DO PERFIL";
                    divDados.style.display = "block";
                } else if (target === "config-sistema" && divConfig) {
                    if (titulo) titulo.innerText = "CONFIGURAÇÕES DE PREFERÊNCIAS VISUAIS";
                    divConfig.style.display = "block";
                } else if (target === "alterar-senha" && divSenha) {
                    if (titulo) titulo.innerText = "SEGURANÇA: ALTERAÇÃO DE CREDENCIAIS DE ACESSO";
                    divSenha.style.display = "block";
                }
            }, 100);
        } else if (target === "clientes") {
            carregarTelaDinamica("cadastro-clientes.html");
        } else if (target === "produtos") {
            carregarTelaDinamica("cadastro-produtos.html", "script-produtos.js");
        } else if (target === "fornecedores") {
            carregarTelaDinamica("cadastro-fornecedores.html", "script-fornecedores.js");
        } else if (target === "categorias") {
            carregarTelaDinamica("cadastro-categorias.html", "script-categorias.js");
        } else if (target === "lista-clientes") {
            carregarTelaDinamica("lista-clientes.html", "script-lista-clientes.js");
        } else if (target === "lista-fornecedores") {
            carregarTelaDinamica("lista-fornecedores.html", "script-lista-fornecedores.js");
        } else if (target === "lista-produtos") {
            carregarTelaDinamica("lista-produtos.html", "script-lista-produtos.js");
        } else if (target === "lista-pedidos") {
            carregarTelaDinamica("lista-pedidos.html", "script-lista-pedidos.js");
        } else if (target === "pedidos") {
            carregarTelaDinamica("cadastro-pedidos.html", "script-pedidos.js");
        } else if (target === "usuarios") {
            carregarTelaDinamica("cadastro-usuarios.html", "script-usuarios.js");
        } else {
            const placeholder = document.createElement("div");
            placeholder.className = "development-placeholder";
            placeholder.innerHTML = `
                <div style="background: white; padding: 40px; border-radius: 8px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <i class="fa-solid fa-code" style="font-size: 48px; color: #cbd5e1; margin-bottom: 20px;"></i>
                    <h2>Módulo em Desenvolvimento</h2>
                    <p>A tela para o componente <strong>${target.toUpperCase()}</strong> será integrada na próxima etapa do PI.</p>
                </div>
            `;
            container.appendChild(placeholder);
        }
    }

    function carregarTelaDinamica(urlArquivo, nomeScriptDaTela = "script.js") {
        const loader = document.createElement("div");
        loader.className = "development-placeholder";
        loader.innerHTML = `<div style="text-align: center; padding: 50px;"><i class="fa-solid fa-spinner fa-spin" style="font-size: 32px; color: #0284c7;"></i><p>Carregando componente...</p></div>`;
        container.appendChild(loader);

        fetch(urlArquivo)
            .then(response => {
                if (!response.ok) throw new Error("Erro ao carregar componente HTML.");
                return response.text();
            })
            .then(htmlTexto => {
                loader.remove();
                const wrapper = document.createElement("div");
                wrapper.innerHTML = htmlTexto;
                container.appendChild(wrapper.firstElementChild);

                // Passa o script específico da tela ativa
                reexecutarScriptsDaTela(nomeScriptDaTela);
            })
            .catch(error => {
                loader.innerHTML = `<div style="color: red; padding: 20px;">Não foi possível abrir o módulo: ${error.message}</div>`;
            });
    }

    function reexecutarScriptsDaTela(nomeScript) {
        const scriptId = document.getElementById("script-tela-ativa");
        if (scriptId) scriptId.remove();

        const novoScript = document.createElement("script");
        novoScript.id = "script-tela-ativa";
        novoScript.src = "js/" + nomeScript;
        document.body.appendChild(novoScript);
    }

    function carregarKpisReaisDoDashboard() {
        const API_URL = "http://localhost:8080/api/dashboard/kpis";
        const formatador = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                const txtFaturamento = document.getElementById("kpi-faturamento");
                const txtPedidos = document.getElementById("kpi-pedidos");
                const txtClientes = document.getElementById("kpi-clientes");

                if (txtFaturamento) txtFaturamento.innerText = formatador.format(data.faturamentoMensal);
                if (txtPedidos) txtPedidos.innerText = `${data.pedidosFaturados} Pedidos`;
                if (txtClientes) txtClientes.innerText = `${data.clientesNovos} Ativos`;
            })
            .catch(err => console.error("Falha ao atualizar painel:", err));
    }

    // Dispara a atualização na abertura do painel
    carregarKpisReaisDoDashboard();

    function carregarGraficoDinamicoDoBanco() {
        const API_URL = "http://localhost:8080/api/dashboard/grafico-vendas";

        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                if (!data || data.length === 0) return;

                // Racha o cálculo de proporção baseado na categoria que mais vendeu (topo = 100% da altura)
                const maiorQtd = Math.max(...data.map(item => item.quantidade)) || 1;

                data.forEach((item, index) => {
                    const barra = document.getElementById(`bar${index}`);
                    const legenda = document.getElementById(`lbl${index}`);

                    if (barra && legenda) {
                        // Calcula a porcentagem de altura reativa proporcional de forma segura
                        const porcentagemAltura = (item.quantidade / maiorQtd) * 90 + 10; // Mínimo de 10% para não sumir o card
                        barra.style.height = `${porcentagemAltura}%`;
                        barra.title = `${item.categoria}: ${item.quantidade} unidades`;
                        legenda.innerText = item.categoria;
                    }
                });
            })
            .catch(err => console.error("Falha ao atualizar gráfico:", err));
    }

    // Dispara o gráfico junto com os KPIs na inicialização
    carregarGraficoDinamicoDoBanco();

});
