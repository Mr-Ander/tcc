document.addEventListener("DOMContentLoaded", () => {
    carregarPendentes();
});

async function carregarPendentes() {
    const container = document.getElementById("listaPendentes");
    const mensagemVazio = document.getElementById("mensagemVazio");

    if (!container || !mensagemVazio) return;

    try {
        const response = await authenticatedFetch(`${API_URL}/plantas?status=pendente`);
        if (!response || !response.ok) return;
        const plantasPendentes = await response.json();

        if (plantasPendentes.length === 0) {
            mensagemVazio.style.display = "block";
            container.innerHTML = "";
            return;
        }

        mensagemVazio.style.display = "none";
        container.innerHTML = "";

        plantasPendentes.forEach((planta) => {
            const card = document.createElement("div");
            card.className = "card-pendente";

            const h2 = document.createElement("h2");
            h2.textContent = planta.nome;

            const pEspecie = document.createElement("p");
            pEspecie.innerHTML = `<strong>Espécie:</strong> ${document.createTextNode(planta.especie).textContent}`;
            
            const createLabelValue = (label, value) => {
                const p = document.createElement("p");
                const strong = document.createElement("strong");
                strong.textContent = label + ": ";
                p.appendChild(strong);
                p.appendChild(document.createTextNode(value || "Não informado"));
                return p;
            };

            const pCategoria = createLabelValue("Categoria", planta.categoria);
            const pLocal = createLabelValue("Local de coleta", planta.local_encontro);
            const pObs = createLabelValue("Observações", planta.observacoes);

            const acoes = document.createElement("div");
            acoes.className = "acoes";

            const btnAprovar = document.createElement("button");
            btnAprovar.className = "btn-aprovar";
            btnAprovar.textContent = "APROVAR";
            btnAprovar.onclick = () => aprovarPlanta(planta.id);

            const btnRejeitar = document.createElement("button");
            btnRejeitar.className = "btn-rejeitar";
            btnRejeitar.textContent = "REJEITAR";
            btnRejeitar.onclick = () => rejeitarPlanta(planta.id);

            acoes.appendChild(btnAprovar);
            acoes.appendChild(btnRejeitar);

            card.appendChild(h2);
            card.appendChild(pEspecie);
            card.appendChild(pCategoria);
            card.appendChild(pLocal);
            card.appendChild(pObs);
            card.appendChild(acoes);

            container.appendChild(card);
        });
    } catch (e) {
        container.innerHTML = "<p>Erro ao carregar plantas do servidor.</p>";
    }
}

async function aprovarPlanta(id) {
    try {
        const response = await authenticatedFetch(`${API_URL}/plantas/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'aprovada' })
        });

        if (response && response.ok) {
            alert("Planta aprovada com sucesso!");
            carregarPendentes();
        } else {
            alert("Erro ao aprovar planta.");
        }
    } catch (e) {
        alert("Erro de conexão com o servidor.");
    }
}

async function rejeitarPlanta(id) {
    if (!confirm("Tem certeza que deseja rejeitar esta planta?")) {
        return;
    }

    try {
        const response = await authenticatedFetch(`${API_URL}/plantas/${id}`, {
            method: 'DELETE'
        });

        if (response && response.ok) {
            alert("Planta rejeitada!");
            carregarPendentes();
        } else {
            alert("Erro ao rejeitar planta.");
        }
    } catch (e) {
        alert("Erro de conexão com o servidor.");
    }
}

function voltarPainel() {
    window.location.href = "painel-admin.html";
}
