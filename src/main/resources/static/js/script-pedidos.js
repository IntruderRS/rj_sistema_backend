(function() {
    const form = document.getElementById("formPedido");
    if (!form) return;

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

    let carrinhoItens = []; // Array que armazena os itens (Equivalente à List<ItemPedido>)

    const formatador = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

    // 1. ADICIONAR ITEM AO CARRINHO (COMPORTAMENTO MULTIPLICADOR DO PDV)
    btnAdicionar.addEventListener("click", () => {
        if (cbProduto.selectedIndex <= 0) {
            alert("Por favor, selecione um produto válido para lançar.");
            return;
        }

        const optionSelecionada = cbProduto.options[cbProduto.selectedIndex];
        const prodId = parseInt(cbProduto.value);
        const prodNome = optionSelecionada.text.split(" (")[0];
        const precoUnitario = parseFloat(optionSelecionada.getAttribute("data-preco"));
        const quantidade = parseInt(txtQtd.value) || 1;

        // Se o produto já foi lançado, apenas acumula a quantidade (SOLID)
        const itemExistente = carrinhoItens.find(item => item.produtoId === prodId);
        if (itemExistente) {
            itemExistente.qtd += quantidade;
            itemExistente.subtotal = itemExistente.qtd * itemExistente.preco;
        } else {
            carrinhoItens.push({
                itemNro: carrinhoItens.length + 1,
                produtoId: prodId,
                nome: prodNome,
                qtd: quantidade,
                preco: precoUnitario,
                subtotal: quantidade * precoUnitario
            });
        }

        cbProduto.selectedIndex = 0;
        txtQtd.value = 1;
        renderizarCarrinhoECalcular();
    });

    // 2. REDESENHA O GRID DO CARRINHO E CALCULA OS TOTAIS (REATIVO)
    function renderizarCarrinhoECalcular() {
        tbody.innerHTML = "";
        let somatorioItens = 0;

        carrinhoItens.forEach((item, index) => {
            item.itemNro = index + 1; // Reorganiza a contagem dos itens
            somatorioItens += item.subtotal;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="text-align: center;"><strong>${item.itemNro}</strong></td>
                <td style="text-align: center;">${item.produtoId}</td>
                <td>${item.nome}</td>
                <td style="text-align: center; font-weight: bold;">${item.qtd}</td>
                <td style="text-align: right; font-family: monospace;">${formatador.format(item.preco)}</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold;">${formatador.format(item.subtotal)}</td>
                <td style="text-align: center;">
                    <button type="button" class="btn-action-sm delete" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Configura o botão de remoção rápida de item do carrinho
        tbody.querySelectorAll(".btn-action-sm.delete").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"));
                carrinhoItens.splice(idx, 1);
                renderizarCarrinhoECalcular();
            });
        });

        recalcularTotaisFinais(somatorioItens);
    }

    // 3. CENTRALIZAÇÃO OPERACIONAL DA MATEMÁTICA FINANCEIRA (MÉTODO RECALCULAR_TOTAL DO JUNIT)
    function recalcularTotaisFinais(valorBaseItens = 0) {
        // Se a função foi chamada sem parâmetro, calcula o somatório do array
        if (valorBaseItens === 0 && carrinhoItens.length > 0) {
            valorBaseItens = carrinhoItens.reduce((sum, item) => sum + item.subtotal, 0);
        }

        const frete = parseFloat(txtFrete.value.trim().replace(",", ".")) || 0;
        const imposto = parseFloat(txtImposto.value.trim().replace(",", ".")) || 0;
        const descPorcentagem = parseFloat(txtDesconto.value.trim().replace(",", ".")) || 0;

        // Executa as equações matemáticas compostas acumulando taxas
        let totalProvisorio = valorBaseItens + frete + imposto;
        let abatimento = totalProvisorio * (descPorcentagem / 100);
        let valorLiquidoFinal = totalProvisorio - abatimento;

        if (valorLiquidoFinal < 0) valorLiquidoFinal = 0;

        // INJETA O VALOR NO VISUAL COM PONTO DE MILHAR (Ex: R$ 1.500,00)
        lblTotal.innerText = formatador.format(valorLiquidoFinal);
    }

    // GATILHOS REATIVOS: Atualiza o total líquido instantaneamente ao digitar taxas ou frete
    txtFrete.addEventListener("input", () => recalcularTotaisFinais(0));
    txtImposto.addEventListener("input", () => recalcularTotaisFinais(0));
    txtDesconto.addEventListener("input", () => recalcularTotaisFinais(0));

    // 4. EVENTO DE REGISTRO DA VENDA (SUBMIT)
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (carrinhoItens.length === 0) {
            alert("Erro Operacional: Não é possível faturar um pedido sem itens no carrinho!");
            return;
        }

        const pedidoVendaObjeto = {
            clienteId: document.getElementById("cbClientePedido").value,
            formaPagto: document.getElementById("cbFormaPagto").value,
            tipoFrete: document.getElementById("cbTipoFretePedido").value,
            valorFrete: parseFloat(txtFrete.value.replace(",", ".")),
            descontoPorcentagem: parseFloat(txtDesconto.value.replace(",", ".")),
            imposto: parseFloat(txtImposto.value.replace(",", ".")),
            totalLiquido: parseFloat(lblTotal.innerText.replace(/[R$\s]/g, "").replace(".", "").replace(",", ".")),
            itens: carrinhoItens,
            status: "FINALIZADO"
        };

        console.log("Pedido fechado pronto para ser persistido via REST API:", pedidoVendaObjeto);
        alert(`Pedido faturado com sucesso absoluto!\nValor Liquido: ${lblTotal.innerText}\nStatus: FINALIZADO.\nO Grid visual de itens foi limpo!`);
        
        limparTelaCompleta();
    });

    function limparTelaCompleta() {
        form.reset();
        carrinhoItens = [];
        tbody.innerHTML = "";
        txtFrete.value = "0,00";
        txtDesconto.value = "0,0";
        txtImposto.value = "0,00";
        lblTotal.innerText = "R$ 0,00";
        document.getElementById("cbClientePedido").focus();
    }

    btnLimpar.addEventListener("click", limparTelaCompleta);

    btnPesquisar.addEventListener("click", () => {
        // Redireciona de forma reativa para a lista histórica que criamos no passo anterior
        const itemMenuListaPedidos = document.querySelector('.submenu-item[data-target="lista-pedidos"]');
        if (itemMenuListaPedidos) {
            itemMenuListaPedidos.click();
        }
    });

})();
