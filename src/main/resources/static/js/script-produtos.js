(function() {
    const form = document.getElementById("formProduto");
    if (!form) return; // Blinda o script caso o formulário não esteja renderizado

    const txtValorCusto = document.getElementById("txtValorCusto");
    const txtPorcentagemLucro = document.getElementById("txtPorcentagemLucro");
    const txtValorVenda = document.getElementById("txtValorVenda");
    const btnLimpar = document.getElementById("btnLimparProduto");
    const btnBuscar = document.getElementById("btnBuscarProduto");

    // FUNÇÃO QUE CALCULA A MARGEM DE LUCRO REATIVAMENTE (IGUAL AO SEU SERVICE DO JAVA)
    function calcularPrecoVendaAutomatico() {
        const custo = parseFloat(txtValorCusto.value.trim().replace(",", ".")) || 0;
        const lucro = parseFloat(txtPorcentagemLucro.value.trim().replace(",", ".")) || 0;

        if (custo > 0 && lucro > 0) {
            const margem = custo * (lucro / 100);
            const vendaFinal = custo + margem;
            txtValorVenda.value = vendaFinal.toFixed(2).replace(".", ",");
        } else if (custo > 0) {
            txtValorVenda.value = custo.toFixed(2).replace(".", ",");
        } else {
            txtValorVenda.value = "";
        }
    }

    // Ouvintes de evento para monitorar a digitação em tempo real
    txtValorCusto.addEventListener("input", calcularPrecoVendaAutomatico);
    txtPorcentagemLucro.addEventListener("input", calcularPrecoVendaAutomatico);

    // EVENTO DE SUBMIT (SALVAR PRODUTO)
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const produtoObjeto = {
            id: document.getElementById("txtIDProduto").value || null,
            nome: document.getElementById("txtNomeProduto").value.trim(),
            valorCusto: parseFloat(txtValorCusto.value.replace(",", ".")),
            porcentagemLucro: parseFloat(txtPorcentagemLucro.value.replace(",", ".")),
            valorVenda: parseFloat(txtValorVenda.value.replace(",", ".")),
            quantidade: parseInt(document.getElementById("txtQuantidadeEstoque").value),
            peso: parseFloat(document.getElementById("txtPeso").value.replace(",", ".")),
            dimensoes: document.getElementById("txtDimensoes").value.trim(),
            codigoBarras: document.getElementById("txtCodigoBarras").value.trim(),
            ncm: document.getElementById("txtNCM").value.trim(),
            lote: document.getElementById("txtLote").value.trim(),
            vencimento: document.getElementById("txtVencimento").value,
            categoriaId: document.getElementById("cbCategoriaProduto").value,
            fornecedorId: document.getElementById("cbFornecedorProduto").value,
            observacao: document.getElementById("txtObservacaoProduto").value.trim()
        };

        console.log("JSON de Produto pronto para envio ao Backend:", produtoObjeto);
        alert(`Produto "${produtoObjeto.nome}" validado e processado com sucesso na Web!\nPreço de Venda calculado: R$ ${txtValorVenda.value}`);
        form.reset();
    });

    btnLimpar.addEventListener("click", () => {
        form.reset();
        document.getElementById("txtNomeProduto").focus();
    });

    btnBuscar.addEventListener("click", () => {
        const idBusca = prompt("Insira o ID do Produto que deseja consultar:");
        if (idBusca && !isNaN(idBusca)) {
            alert(`Simulação: Hidratando o formulário com dados do produto ID ${idBusca}...`);
            document.getElementById("txtIDProduto").value = idBusca;
            document.getElementById("txtNomeProduto").value = "Amortecedor Pressurizado Cofap";
            document.getElementById("txtValorCusto").value = "200,00";
            document.getElementById("txtPorcentagemLucro").value = "50,0";
            document.getElementById("txtValorVenda").value = "320,00";
            document.getElementById("txtQuantidadeEstoque").value = "20";
            document.getElementById("txtDimensoes").value = "10X50X10";
            document.getElementById("txtPeso").value = "15,00";
            document.getElementById("txtCodigoBarras").value = "54147789654123";
            document.getElementById("txtNCM").value = "22445577885566";

            calcularPrecoVendaAutomatico();
        }
    });
})();
