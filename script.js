let filtrosAtivos = {};
let tipoSelecionado = "";
let ordenacaoAtual = { campo: null, direcao: null };


const imoveis = [
    {
        titulo: "Lote no Centro",
        tipo: "lote",
        bairro: "Centro",
        cidade: "Itaúna - MG",
        preco: 120000,
        tamanho: 300,
        imagem: "https://via.placeholder.com/300x200",
        whatsapp: "5531999999999"
    },
    {
        titulo: "Casa no Santanense",
        tipo: "casa",
        bairro: "Santanense",
        cidade: "Itaúna - MG",
        preco: 350000,
        tamanho: 180,
        imagem: "https://via.placeholder.com/300x200",
        whatsapp: "5531999999999"
    },
    {
        titulo: "Lote São Bento",
        tipo: "lote",
        bairro: "Sao Bento",
        cidade: "Itaúna - MG",
        preco: 95000,
        tamanho: 250,
        imagem: "https://via.placeholder.com/300x200",
        whatsapp: "5531999999999"
    }
];

const lista = document.getElementById("lista-imoveis");

imoveis.forEach(imovel => {
    lista.innerHTML += `
        <div class="card">
            <img src="${imovel.imagem}">
            <h2>${imovel.titulo}</h2>
            <p>📍 ${imovel.cidade}</p>
            <p>💰 ${imovel.preco}</p>
            <a href="https://wa.me/${imovel.whatsapp}" target="_blank">
                Falar no WhatsApp
            </a>
        </div>
    `;
});

function proximaPergunta() {
    const tipo = document.getElementById("tipo-imovel").value;

    if (!tipo) {
        alert("Selecione uma opção");
        return;
    }

    document.getElementById("pergunta1").style.display = "none";

    if (tipo === "olhando") {
        fecharModal();
    } else {
        document.getElementById("pergunta2").style.display = "block";
    }
}

function selectTipo(tipo) {
    tipoSelecionado = tipo;
    document.getElementById("step1").style.display = "none";

    if (tipo === "olhando") {
        fecharModal();
    } else {
        document.getElementById("step2").style.display = "block";
    }
}

function mostrarFiltros() {
    document.getElementById("step2").style.display = "none";
    document.getElementById("step3").style.display = "block";

    const checkboxes = document.querySelectorAll(".filtro");
    const botao = document.getElementById("btnProximo");

    checkboxes.forEach(cb => {
        cb.addEventListener("change", () => {
            botao.disabled = ![...checkboxes].some(c => c.checked);
        });
    });
}

function fecharModal() {
    document.getElementById("modal").style.display = "none";
}

function irParaCampos() {
    document.getElementById("step3").style.display = "none";
    document.getElementById("step4").style.display = "block";

    const container = document.getElementById("campos-filtros");
    container.innerHTML = "";

    document.querySelectorAll(".filtro").forEach(filtro => {
        if (filtro.checked) {
            const texto = filtro.parentElement.innerText;

            if (texto.includes("Bairro")) {
                container.innerHTML += `
                    <select id="filtro-bairro">
                        <option value="">Selecione o bairro</option>
                        <option value="Sao Bento">São Bento</option>
                        <option value="Santanense">Santanense</option>
                        <option value="Centro">Centro</option>
                    </select>
                `;
            }

            if (texto.includes("Valor mínimo")) {
                container.innerHTML += `
                    <input type="number" id="filtro-min" placeholder="Valor mínimo">
                `;
            }

            if (texto.includes("Valor máximo")) {
                container.innerHTML += `
                    <input type="number" id="filtro-max" placeholder="Valor máximo">
                `;
            }

            if (texto.includes("Tamanho")) {
                container.innerHTML += `
                    <input type="number" id="filtro-tamanho" placeholder="Tamanho mínimo (m²)">
                `;
            }
        }
    });
}

function aplicarFiltros() {
    filtrosAtivos = {
        tipo: tipoSelecionado || null,
        bairro: document.getElementById("filtro-bairro")?.value || null,
        valorMin: document.getElementById("filtro-min")?.value || null,
        valorMax: document.getElementById("filtro-max")?.value || null,
        tamanho: document.getElementById("filtro-tamanho")?.value || null
    };

    let resultado = imoveis.filter(imovel => {

        if (filtrosAtivos.tipo && imovel.tipo !== filtrosAtivos.tipo) return false;
        if (filtrosAtivos.bairro && imovel.bairro !== filtrosAtivos.bairro) return false;
        if (filtrosAtivos.valorMin && imovel.preco < filtrosAtivos.valorMin) return false;
        if (filtrosAtivos.valorMax && imovel.preco > filtrosAtivos.valorMax) return false;
        if (filtrosAtivos.tamanho && imovel.tamanho < filtrosAtivos.tamanho) return false;

        return true;
    });

    //renderizarImoveis(resultado);
    atualizarTela()
    mostrarFiltrosAtivos();
    fecharModal();
}

function renderizarImoveis(listaImoveis) {
    const lista = document.getElementById("lista-imoveis");
    lista.innerHTML = "";

    if (listaImoveis.length === 0) {
        lista.innerHTML = "<p>Nenhum imóvel encontrado.</p>";
        return;
    }

    listaImoveis.forEach(imovel => {
        lista.innerHTML += `
            <div class="card">
                <img src="${imovel.imagem}">
                <h2>${imovel.titulo}</h2>
                <p>📍 ${imovel.bairro} - ${imovel.cidade}</p>
                <p>📐 ${imovel.tamanho} m²</p>
                <p>💰 R$ ${imovel.preco.toLocaleString("pt-BR")}</p>
                <a href="https://wa.me/${imovel.whatsapp}" target="_blank">
                    Falar no WhatsApp
                </a>
            </div>
        `;
    });
}

function mostrarFiltrosAtivos() {
    const area = document.getElementById("filtros-ativos");
    area.innerHTML = "";

    const temFiltros = Object.values(filtrosAtivos).some(v => v);

    if (!temFiltros) {
        area.style.display = "none";
        return;
    }

    area.style.display = "flex";

    Object.entries(filtrosAtivos).forEach(([chave, valor]) => {
        if (!valor) return;

        let texto = "";

        if (chave === "tipo") texto = `Tipo: ${valor}`;
        if (chave === "bairro") texto = `Bairro: ${valor}`;
        if (chave === "valorMin") texto = `Valor mín: ${valor}`;
        if (chave === "valorMax") texto = `Valor máx: ${valor}`;
        if (chave === "tamanho") texto = `Tamanho mín: ${valor} m²`;

        area.innerHTML += `
            <div class="filtro-tag">
                ${texto}
                <span onclick="removerFiltro('${chave}')">✕</span>
            </div>
        `;
    });

    area.innerHTML += `
        <button id="alterar-filtros" onclick="abrirAlterarFiltros()">Alterar filtros</button>
        <button id="limpar-tudo" onclick="limparTudo()">Limpar tudo</button>
    `;
}


function removerFiltro(chave) {
    function removerFiltro(chave) {
    filtrosAtivos[chave] = null;
    aplicarFiltrosEOrdenacao();
}

}

function abrirAlterarFiltros() { //ALTERAR FILTROS
    const modal = document.getElementById("modal");
    modal.style.display = "flex";

    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "none";
    document.getElementById("step3").style.display = "block";
    document.getElementById("step4").style.display = "none";
}

function ordenar(campo, direcao) {
    ordenacaoAtual = { campo, direcao };
    aplicarFiltrosEOrdenacao();
}

function aplicarFiltrosEOrdenacao() {
    let resultado = imoveis.filter(imovel => {

        if (filtrosAtivos.tipo && imovel.tipo !== filtrosAtivos.tipo) return false;
        if (filtrosAtivos.bairro && imovel.bairro !== filtrosAtivos.bairro) return false;
        if (filtrosAtivos.valorMin && imovel.preco < filtrosAtivos.valorMin) return false;
        if (filtrosAtivos.valorMax && imovel.preco > filtrosAtivos.valorMax) return false;
        if (filtrosAtivos.tamanho && imovel.tamanho < filtrosAtivos.tamanho) return false;

        return true;
    });

    if (ordenacaoAtual.campo) {
        resultado.sort((a, b) => {
            if (ordenacaoAtual.direcao === "asc") {
                return a[ordenacaoAtual.campo] - b[ordenacaoAtual.campo];
            } else {
                return b[ordenacaoAtual.campo] - a[ordenacaoAtual.campo];
            }
        });
    }

    renderizarImoveis(resultado); //CHAMR SEMPRE atualizarTela()
    atualizarTela() 
    mostrarFiltrosAtivos();
}

window.onload = () => {
    document.getElementById("modal").style.display = "flex";

    // garante que começa sempre no passo 1
    document.getElementById("step1").style.display = "block";
    document.getElementById("step2").style.display = "none";
    document.getElementById("step3").style.display = "none";
    document.getElementById("step4").style.display = "none";
};


function limparTudo() { //DEVE LIMPRAR O FILTRO
     filtrosAtivos = {
        tipo: null,
        bairro: null,
        valorMin: null,
        valorMax: null,
        tamanho: null
    };

    tipoSelecionado = null;
    ordenacaoAtual = { campo: null, direcao: null };

    atualizarTela();
}

function atualizarTela() {
    let resultado = imoveis.filter(imovel => {

        if (filtrosAtivos.tipo && imovel.tipo !== filtrosAtivos.tipo) return false;
        if (filtrosAtivos.bairro && imovel.bairro !== filtrosAtivos.bairro) return false;
        if (filtrosAtivos.valorMin && imovel.preco < filtrosAtivos.valorMin) return false;
        if (filtrosAtivos.valorMax && imovel.preco > filtrosAtivos.valorMax) return false;
        if (filtrosAtivos.tamanho && imovel.tamanho < filtrosAtivos.tamanho) return false;

        return true;
    });

    if (ordenacaoAtual.campo) {
        resultado.sort((a, b) =>
            ordenacaoAtual.direcao === "asc"
                ? a[ordenacaoAtual.campo] - b[ordenacaoAtual.campo]
                : b[ordenacaoAtual.campo] - a[ordenacaoAtual.campo]
        );
    }

    renderizarImoveis(resultado);
    mostrarFiltrosAtivos();
}




aplicarFiltrosEOrdenacao();
fecharModal();


//renderizarImoveis(imoveis);

console.log("Site carregado com sucesso!");
