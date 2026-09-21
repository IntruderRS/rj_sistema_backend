(function() {
    const form = document.getElementById("formPedido");
    if (!form) return;

    const cbCliente = document.getElementById("cbClientePedido");
    const cbProduto = document.getElementById("cbProdutoPedido");
    const txtQtd = document.getElementById("txtQtdPedido");
    const btnAdicionar = document.getElementById("btnAdicionarItem");
    const tbody = document.getElementById("tbodyItensPedido");
    
    // Elementos de Taxas e Display
    const txtFrete = document.getElementById("txtValorFretePedido");
    const txtDesconto = document.getElementById("txtDescontoPedido");
    const txtImposto = document.getElementById("txtImpostoPedido");
    const lblTotal = document.getElementById("lblTotalPedido");
    
    const btnLimpar = document.getElementById("btnLimparPedido");
    const btnPesquisar = document.getElementById("btnPesquisarPedido");

    let carrinhoItens = []; // Array temporário do carrinho (List<ItemPedido>)
    const formatador = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

    // 1. CARGA DINÂMICA: Abastece o PDV com Clientes e Produtos Reais do Banco
    function inicializarCamposDoPDV() {
        // Busca Clientes do MySQL
        fetch("http://localhost:8080/api/clientes")
            .then(res => res.json())
            .then(clientes => {
                cbCliente.innerHTML = '<option value="" disabled selected>Selecione o Cliente</option>';
                clientes.forEach(c => {
                    cbCliente.innerHTML += `<option value="${c.id}">${c.nomeRazao} (${c.cnpjCpf})</option>`;
                });
            })
            .catch(err => console.error("Erro ao alimentar clientes no PDV:", err));

        // Busca Produtos do MySQL
        fetch("http://localhost:8080/api/produtos")
            .then(res => res.json())
            .then(produtos => {
                cbProduto.innerHTML = '<option value="" disabled selected>Selecione o Produto para adicionar</option>';
                produtos.forEach(p => {
                    cbProduto.innerHTML += `<option value="${p.id}" data-preco="${p.valorVenda}">${p.nome} (${formatador.format(p.valorVenda)})</option>`;
                });
            })
            .catch(err => console.error("Erro ao alimentar produtos no PDV:", err));
    }

    // 2. ADICIONAR ITEM AO CARRINHO (LANÇAMENTO REATIVO)
    btnAdicionar.addEventListener("click", () => {
        if (cbProduto.selectedIndex <= 0) {
            alert("Por favor, selecione um produto válido para lançar.");
            return;
        }

        const optionSelecionada = cbProduto.options[cbProduto.selectedIndex];
        const prodId = parseInt(cbProduto.value);
        // Captura o nome limpando o valor do preço fixo do texto
        const prodNome = optionSelecionada.text.split(" (")[0];
        const precoUnitario = parseFloat(optionSelecionada.getAttribute("data-preco"));
        const quantidade = parseInt(txtQtd.value) || 1;

        // Regra de Acúmulo: se o produto já está na grade, soma a quantidade
        const itemExistente = carrinhoItens.find(item => item.produto.id === prodId);
        if (itemExistente) {
            itemExistente.quantidade += quantidade;
            itemExistente.subtotal = itemExistente.quantidade * itemExistente.preco;
        } else {
            carrinhoItens.push({
                itemNro: carrinhoItens.length + 1,
                produto: { id: prodId, nome: prodNome }, // Envelope no padrão Object esperado pelo JPA
                quantidade: quantidade,
                preco: precoUnitario,
                subtotal: quantidade * precoUnitario
            });
        }

        cbProduto.selectedIndex = 0;
        txtQtd.value = 1;
        renderizarCarrinhoECalcular();
    });

    function renderizarCarrinhoECalcular() {
        tbody.innerHTML = "";
        let somatorioItens = 0;

        carrinhoItens.forEach((item, index) => {
            item.itemNro = index + 1;
            somatorioItens += item.subtotal;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="text-align: center;"><strong>${item.itemNro}</strong></td>
                <td style="text-align: center;">${item.produto.id}</td>
                <td>${item.produto.nome}</td>
                <td style="text-align: center; font-weight: bold;">${item.quantidade}</td>
                <td style="text-align: right; font-family: monospace;">${formatador.format(item.preco)}</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold;">${formatador.format(item.subtotal)}</td>
                <td style="text-align: center;">
                    <button type="button" class="btn-action-sm delete" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll(".btn-action-sm.delete").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"));
                carrinhoItens.splice(idx, 1);
                renderizarCarrinhoECalcular();
            });
        });

        recalcularTotaisFinais(somatorioItens);
    }

    function recalcularTotaisFinais(valorBaseItens = 0) {
        if (valorBaseItens === 0 && carrinhoItens.length > 0) {
            valorBaseItens = carrinhoItens.reduce((sum, item) => sum + item.subtotal, 0);
        }

        const frete = parseFloat(txtFrete.value.trim().replace(",", ".")) || 0;
        const imposto = parseFloat(txtImposto.value.trim().replace(",", ".")) || 0;
        const descPorcentagem = parseFloat(txtDesconto.value.trim().replace(",", ".")) || 0;

        let totalProvisorio = valorBaseItens + frete + imposto;
        let abatimento = totalProvisorio * (descPorcentagem / 100);
        let valorLiquidoFinal = totalProvisorio - abatimento;

        if (valorLiquidoFinal < 0) valorLiquidoFinal = 0;
        lblTotal.innerText = formatador.format(valorLiquidoFinal);
    }

    // Escutas de digitação para reatividade total
    txtFrete.addEventListener("input", () => recalcularTotaisFinais(0));
    txtImposto.addEventListener("input", () => recalcularTotaisFinais(0));
    txtDesconto.addEventListener("input", () => recalcularTotaisFinais(0));

    // 3. FATURAMENTO REAL (POST): Transmite a estrutura Mestre-Detalhe para o Spring Boot
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (carrinhoItens.length === 0) {
            alert("Erro Operacional: Não é possível faturar um pedido sem itens no carrinho!");
            return;
        }

        const pedidoVendaObjeto = {
            cliente: { id: parseInt(cbCliente.value) },
            pagto: document.getElementById("cbFormaPagto").value,
            freteTipo: document.getElementById("cbTipoFretePedido").value,
            freteVal: parseFloat(txtFrete.value.replace(",", ".")),
            desc: parseFloat(txtDesconto.value.replace(",", ".")),
            imposto: parseFloat(txtImposto.value.replace(",", ".")),
            total: parseFloat(lblTotal.innerText.replace(/[R\$\s]/g, "").replace(".", "").replace(",", ".")),
            itens: carrinhoItens,
            status: "FINALIZADO"
        };

        fetch("http://localhost:8080/api/pedidos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedidoVendaObjeto)
        })
        .then(response => {
            if (!response.ok) throw new Error("A API rejeitou o fechamento do faturamento.");
            return response.json();
        })
        .then(pedidoSalvo => {
            alert(`Venda realizada com sucesso absoluto!\nPedido Nº: ${pedidoSalvo.id}\nTotal Líquido: ${formatador.format(pedidoSalvo.total)}\nGravado com sucesso no MySQL!`);
            limparTelaCompleta();
        })
        .catch(err => alert("Erro ao faturar: " + err.message));
    });

    function limparTelaCompleta() {
        form.reset();
        carrinhoItens = [];
        tbody.innerHTML = "";
        txtFrete.value = "0,00";
        txtDesconto.value = "0,0";
        txtImposto.value = "0,00";
        lblTotal.innerText = "R\$ 0,00";
        cbCliente.focus();
    }

    btnLimpar.addEventListener("click", limparTelaCompleta);

    btnPesquisar.addEventListener("click", () => {
        const itemMenuListaPedidos = document.querySelector('.submenu-item[data-target="lista-pedidos"]');
        if (itemMenuListaPedidos) itemMenuListaPedidos.click();
    });

    setTimeout(inicializarCamposDoPDV, 100);
})();
