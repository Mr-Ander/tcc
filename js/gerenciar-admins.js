document.addEventListener("DOMContentLoaded", () => {
    carregarAdmins();
});

async function carregarAdmins() {
    const container = document.getElementById("listaAdmins");

    if (!container) return;

    try {
        const response = await authenticatedFetch(`${API_URL}/admins`);
        if (!response || !response.ok) return;
        const admins = await response.json();

        if (admins.length === 0) {
            container.innerHTML = "<p style='text-align:center; color:#666;'>Nenhum administrador cadastrado</p>";
            return;
        }

        container.innerHTML = "";

        admins.forEach((admin) => {
            const card = document.createElement("div");
            card.className = "admin-card";

            const info = document.createElement("div");
            info.className = "admin-info";
            const strong = document.createElement("strong");
            strong.textContent = admin.email;
            info.appendChild(strong);

            const btnRemover = document.createElement("button");
            btnRemover.className = "btn-remover";
            btnRemover.textContent = "REMOVER";
            btnRemover.disabled = admins.length === 1;
            btnRemover.onclick = () => removerAdmin(admin.id);

            card.appendChild(info);
            card.appendChild(btnRemover);
            container.appendChild(card);
        });
    } catch (e) {
        container.innerHTML = "<p>Erro ao carregar administradores do servidor.</p>";
    }
}

async function adicionarAdmin() {
    const email = document.getElementById("novoEmail").value.trim();
    const mensagem = document.getElementById("mensagemAdd");

    if (email === "") {
        mensagem.textContent = "Digite o email do usuário!";
        mensagem.style.color = "red";
        return;
    }

    try {
        const response = await authenticatedFetch(`${API_URL}/admins`, {
            method: 'POST',
            body: JSON.stringify({ email })
        });

        if (response && response.ok) {
            mensagem.textContent = "Administrador adicionado com sucesso!";
            mensagem.style.color = "green";
            document.getElementById("novoEmail").value = "";
            carregarAdmins();
        } else {
            const data = await response.json();
            mensagem.textContent = (data && data.error) || "Erro ao adicionar administrador.";
            mensagem.style.color = "red";
        }
    } catch (e) {
        mensagem.textContent = "Erro de conexão com o servidor.";
        mensagem.style.color = "red";
    }
}

async function removerAdmin(id) {
    if (!confirm("Tem certeza que deseja remover este administrador?")) {
        return;
    }

    try {
        const response = await authenticatedFetch(`${API_URL}/admins/${id}`, {
            method: 'DELETE'
        });

        if (response && response.ok) {
            alert("Administrador removido!");
            carregarAdmins();
        } else {
            alert("Erro ao remover administrador.");
        }
    } catch (e) {
        alert("Erro de conexão com o servidor.");
    }
}

function voltarPainel() {
    window.location.href = "painel-admin.html";
}
