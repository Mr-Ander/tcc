// Sistema de Comentários para Plantas
(function() {
    // Verifica corretamente se é admin
    const isAdmin = localStorage.getItem("adminLogado") === "true";
    // Usa o nome do usuário logado corretamente
    let nomeUsuario = localStorage.getItem("usuarioNome") || "";
    let comentariosAberto = false;

    // Carrega o CSS de comentários
    const estilos = document.createElement("link");
    estilos.rel = "stylesheet";
    estilos.href = "css/comentarios.css";
    document.head.appendChild(estilos);

    const toggle = document.createElement("button");
    toggle.id = "chat-toggle";
    toggle.title = "Comentários";
    toggle.innerHTML = `&#128172;<span id="chat-badge"></span>`;
    document.body.appendChild(toggle);

    const box = document.createElement("div");
    box.id = "chat-box";
    box.style.display = "none";
    
    // Header
    const header = document.createElement("div");
    header.id = "chat-header";
    const headerSpan = document.createElement("span");
    headerSpan.textContent = "Comentários";
    const onlineSpan = document.createElement("span");
    onlineSpan.id = "chat-online";
    onlineSpan.textContent = "sobre esta planta";
    header.appendChild(headerSpan);
    header.appendChild(onlineSpan);
    
    // Nome Area (if not logged in)
    const nomeArea = document.createElement("div");
    nomeArea.id = "chat-nome-area";
    if (nomeUsuario) nomeArea.style.display = "none";
    const nomeInput = document.createElement("input");
    nomeInput.id = "chat-nome-input";
    nomeInput.placeholder = "Seu nome...";
    nomeInput.maxLength = 20;
    nomeArea.appendChild(nomeInput);
    
    // Mensagens Area
    const mensagensArea = document.createElement("div");
    mensagensArea.id = "chat-mensagens";
    const vazioMsg = document.createElement("p");
    vazioMsg.id = "chat-vazio";
    vazioMsg.textContent = "Nenhum comentário ainda";
    mensagensArea.appendChild(vazioMsg);
    
    // Input Area
    const inputArea = document.createElement("div");
    inputArea.id = "chat-input-area";
    const chatInput = document.createElement("input");
    chatInput.id = "chat-input";
    chatInput.placeholder = "Escreva um comentário...";
    chatInput.maxLength = 300;
    const btnEnviar = document.createElement("button");
    btnEnviar.id = "chat-enviar";
    btnEnviar.textContent = "Enviar";
    inputArea.appendChild(chatInput);
    inputArea.appendChild(btnEnviar);
    
    box.appendChild(header);
    box.appendChild(nomeArea);
    box.appendChild(mensagensArea);
    box.appendChild(inputArea);
    document.body.appendChild(box);

    toggle.addEventListener("click", function() {
        comentariosAberto = !comentariosAberto;
        box.style.display = comentariosAberto ? "flex" : "none";
        if (comentariosAberto) {
            renderComentarios();
            if (nomeUsuario) {
                chatInput.focus();
            } else {
                nomeInput.focus();
            }
        }
    });

    nomeInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            const val = this.value.trim();
            if (val.length < 2) { alert("Nome muito curto!"); return; }
            nomeUsuario = val;
            localStorage.setItem("chatNome", nomeUsuario);
            nomeArea.style.display = "none";
            chatInput.focus();
        }
    });

    btnEnviar.addEventListener("click", enviarComentario);
    chatInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter") enviarComentario();
    });

    function getPlantaId() {
        return localStorage.getItem("plantaSelecionada");
    }

    function enviarComentario() {
        if (!localStorage.getItem("usuarioLogado")) {
            alert("Você precisa fazer login para comentar!");
            window.location.href = "/login";
            return;
        }
        
        const texto = chatInput.value.trim();
        if (!texto) return;
        salvarComentario(texto);
        chatInput.value = "";
    }

    async function salvarComentario(texto) {
        const planta_id = getPlantaId();

        try {
            const response = await authenticatedFetch(`${API_URL}/comentarios`, {
                method: 'POST',
                body: JSON.stringify({
                    planta_id,
                    conteudo: texto
                })
            });

            if (response && response.ok) {
                renderComentarios();
            } else {
                alert("Erro ao enviar comentário.");
            }
        } catch (e) {
            alert("Erro de conexão com o servidor.");
        }
    }

    async function renderComentarios() {
        const container = document.getElementById("chat-mensagens");
        const planta_id = getPlantaId();

        if (!planta_id) return;

        try {
            const response = await authenticatedFetch(`${API_URL}/comentarios/${planta_id}`);
            if (!response || !response.ok) return;
            const comentarios = await response.json();

            if (comentarios.length === 0) {
                container.innerHTML = "";
                const vazio = document.createElement("p");
                vazio.id = "chat-vazio";
                vazio.textContent = "Nenhum comentário ainda";
                container.appendChild(vazio);
                return;
            }

            container.innerHTML = "";
            comentarios.forEach(function(c) {
                const div = document.createElement("div");
                div.className = "chat-msg";
                div.dataset.id = c.id;

                const autor = document.createElement("div");
                autor.className = "msg-autor";
                autor.textContent = c.username;

                const texto = document.createElement("div");
                texto.className = "msg-texto";
                texto.textContent = c.conteudo;

                const hora = document.createElement("div");
                hora.className = "msg-hora";
                hora.textContent = new Date(c.data_criacao).toLocaleDateString("pt-br");

                div.appendChild(autor);
                div.appendChild(texto);
                div.appendChild(hora);

                if (isAdmin) {
                    const btnApagar = document.createElement("button");
                    btnApagar.className = "msg-apagar";
                    btnApagar.title = "Apagar";
                    btnApagar.innerHTML = "&#10005;";
                    btnApagar.onclick = () => window._comentariosApagar(c.id);
                    div.appendChild(btnApagar);
                }

                container.appendChild(div);
            });
            container.scrollTop = container.scrollHeight;
        } catch (e) {
            container.innerHTML = "<p>Erro ao carregar comentários.</p>";
        }
    }

    window._comentariosApagar = async function(id) {
        if (!isAdmin) return;
        if (!confirm("Deseja apagar este comentário?")) return;

        try {
            const response = await authenticatedFetch(`${API_URL}/comentarios/${id}`, {
                method: 'DELETE'
            });

            if (response && response.ok) {
                renderComentarios();
            } else {
                alert("Erro ao apagar comentário.");
            }
        } catch (e) {
            alert("Erro de conexão com o servidor.");
        }
    };
})();
