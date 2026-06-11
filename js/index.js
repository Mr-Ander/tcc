document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("usuarioLogado")) {
        window.location.href = "login.html";
    }

    const usuarioNome = localStorage.getItem("usuarioNome") || "";
    const usuarioNomeSpan = document.getElementById("usuarioNomeSpan");
    if (usuarioNomeSpan) {
        usuarioNomeSpan.textContent = "Olá, " + usuarioNome;
    }

    carregarPlantas();
});

function sair() {
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("adminLogado");
    localStorage.removeItem("usuarioNome");
    localStorage.removeItem("usuarioNomeCompleto");
    localStorage.removeItem("usuarioEmail");
    localStorage.removeItem("usuarioId");
    window.location.href = "login.html";
}

async function carregarPlantas() {
    const container = document.getElementById("listaPlantas");
    const mensagemVazio = document.getElementById("mensagemVazio");

    if (!container || !mensagemVazio) return;

    try {
        const response = await authenticatedFetch(`${API_URL}/plantas?status=aprovada`);
        if (!response || !response.ok) return;
        const plantasAprovadas = await response.json();

        if (plantasAprovadas.length === 0) {
            mensagemVazio.style.display = "block";
            container.innerHTML = "";
            return;
        }

        mensagemVazio.style.display = "none";
        container.innerHTML = "";

        plantasAprovadas.forEach((planta) => {
            const card = document.createElement("div");
            card.className = "card";

            const img = document.createElement("img");
            img.src = planta.foto || 'https://via.placeholder.com/150';
            img.alt = planta.nome;

            const info = document.createElement("div");
            info.className = "info";

            const h2 = document.createElement("h2");
            h2.textContent = planta.nome;

            const p = document.createElement("p");
            const statusSpan = document.createElement("span");
            statusSpan.className = `status green`;
            p.appendChild(statusSpan);
            p.appendChild(document.createTextNode(planta.especie));

            info.appendChild(h2);
            info.appendChild(p);

            const btn = document.createElement("button");
            btn.className = "btn";
            btn.textContent = "Detalhes";
            btn.onclick = () => irDetalhes(planta.id);

            card.appendChild(img);
            card.appendChild(info);
            card.appendChild(btn);

            container.appendChild(card);
        });
    } catch (e) {
        container.innerHTML = "<p>Erro ao carregar plantas do servidor.</p>";
    }
}

function irDetalhes(id) {
    localStorage.setItem("plantaSelecionada", id);
    window.location.href = "detalhes.html";
}

function irCadastro() {
    window.location.href = "cadastro.html";
}
