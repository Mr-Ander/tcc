document.addEventListener("DOMContentLoaded", () => {
    atualizarContadores();
});

async function atualizarContadores() {
    try {
        const response = await authenticatedFetch(`${API_URL}/plantas?status=pendente`);
        if (!response || !response.ok) return;
        const plantasPendentes = await response.json();
        const totalPendentes = document.getElementById("totalPendentes");
        if (totalPendentes) {
            totalPendentes.textContent = plantasPendentes.length + " plantas aguardando aprovação";
        }
    } catch (e) {
        console.error("Erro ao atualizar contadores:", e);
    }
}

function irPendentes() {
    window.location.href = "pendentes.html";
}

function irGerenciarAdmins() {
    window.location.href = "gerenciar-admins.html";
}

function irIndex() {
    window.location.href = "index.html";
}
