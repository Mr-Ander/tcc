document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("usuarioLogado")) {
        window.location.href = "/login";
    }
    carregarDetalhes();
});

async function carregarDetalhes() {
    const id = localStorage.getItem("plantaSelecionada");

    if (!id) {
        alert("Planta não encontrada!");
        window.location.href = "/";
        return;
    }

    try {
        const response = await authenticatedFetch(`${API_URL}/plantas/${id}`);
        if (!response) return;
        if (!response.ok) {
            alert("Planta não encontrada!");
            window.location.href = "/";
            return;
        }
        const planta = await response.json();

        // Info Principal
        document.getElementById("nomePlanta").textContent = planta.nome;
        
        // Usando innerHTML apenas para manter os emojis fixos, mas o conteúdo é seguro
        document.getElementById("especiePlanta").innerHTML = `<span>🌿</span> Espécie: ${document.createTextNode(planta.especie).textContent}`;
        document.getElementById("categoriaPlanta").innerHTML = `<span>🏷️</span> Categoria: ${document.createTextNode(planta.categoria).textContent}`;
        document.getElementById("localPlanta").innerHTML = `<span>📍</span> Local: ${document.createTextNode(planta.local_encontro || "Não informado").textContent}`;
        
        // Timeline
        document.getElementById("dataCadastro").textContent = new Date(planta.data_cadastro).toLocaleDateString("pt-br") || "N/A";
        document.getElementById("dataAprovacao").textContent = planta.status === 'aprovada' ? "Aprovada" : "Pendente";
        
        // Observações
        document.getElementById("observacoes").textContent = planta.observacoes || "Nenhuma observação registrada pelo coletor.";
        
        const img = document.getElementById("imgPlanta");
        if (planta.foto) {
            img.src = planta.foto;
        } else {
            img.src = "https://via.placeholder.com/150";
        }
        img.alt = planta.nome;
    } catch (e) {
        alert("Erro ao carregar detalhes da planta.");
    }
}

function voltar() {
    window.location.href = "/";
}
