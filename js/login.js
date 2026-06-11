function mostrarLoginPessoa() {
    document.getElementById("tela-escolha").style.display = "none";
    document.getElementById("tela-pessoa").style.display = "block";
    document.getElementById("pessoa-email").focus();
}

function mostrarLoginAdmin() {
    document.getElementById("tela-escolha").style.display = "none";
    document.getElementById("tela-admin").style.display = "block";
    document.getElementById("admin-email").focus();
}

function mostrarCadastro() {
    document.getElementById("tela-escolha").style.display = "none";
    document.getElementById("tela-cadastro").style.display = "block";
    document.getElementById("cadastro-username").focus();
}

function voltarEscolha() {
    document.getElementById("tela-pessoa").style.display = "none";
    document.getElementById("tela-admin").style.display = "none";
    document.getElementById("tela-cadastro").style.display = "none";
    document.getElementById("tela-escolha").style.display = "block";
    
    // Limpar campos
    const inputs = document.querySelectorAll("input");
    inputs.forEach(input => input.value = "");
    
    const erros = document.querySelectorAll(".erro");
    erros.forEach(erro => erro.textContent = "");
}

async function cadastrarUsuario() {
    const username = document.getElementById("cadastro-username").value.trim();
    const nome = document.getElementById("cadastro-nome").value.trim();
    const email = document.getElementById("cadastro-email").value.trim();
    const senha = document.getElementById("cadastro-senha").value;
    const confirmar = document.getElementById("cadastro-confirmar").value;
    const erro = document.getElementById("erro-cadastro");

    if (username.length < 2) {
        erro.textContent = "Username deve ter pelo menos 2 caracteres!";
        return;
    }
    if (nome.length < 2) {
        erro.textContent = "Preencha seu nome completo!";
        return;
    }
    if (!email.includes("@") || !email.includes(".")) {
        erro.textContent = "Digite um email válido!";
        return;
    }
    if (senha.length < 4) {
        erro.textContent = "Senha deve ter pelo menos 4 caracteres!";
        return;
    }
    if (senha !== confirmar) {
        erro.textContent = "As senhas não conferem!";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/cadastro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, nome, email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Cadastro realizado com sucesso! Faça login.");
            voltarEscolha();
        } else {
            erro.textContent = data.error || "Erro ao realizar cadastro.";
        }
    } catch (e) {
        erro.textContent = "Erro de conexão com o servidor.";
    }
}

async function entrarComoPessoa() {
    const email = document.getElementById("pessoa-email").value.trim();
    const senha = document.getElementById("pessoa-senha").value;
    const erro = document.getElementById("erro-pessoa");

    if (email === "" || senha === "") {
        erro.textContent = "Preencha todos os campos!";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("usuarioLogado", "true");
            localStorage.setItem("userToken", data.token);
            localStorage.setItem("usuarioNome", data.username);
            localStorage.setItem("usuarioNomeCompleto", data.nome);
            localStorage.setItem("usuarioEmail", data.email);
            localStorage.setItem("usuarioId", data.id);
            if (data.is_admin) {
                localStorage.setItem("adminLogado", "true");
                window.location.href = "/painel-admin";
            } else {
                localStorage.removeItem("adminLogado");
                window.location.href = "/";
            }
        } else {
            erro.textContent = data.error || "Email ou senha incorretos!";
        }
    } catch (e) {
        erro.textContent = "Erro de conexão com o servidor.";
    }
}

async function entrarComoAdmin() {
    const email = document.getElementById("admin-email").value.trim();
    const senha = document.getElementById("admin-senha").value;
    const erro = document.getElementById("erro-admin");

    if (email === "" || senha === "") {
        erro.textContent = "Preencha todos os campos!";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            if (data.is_admin) {
                localStorage.setItem("adminLogado", "true");
                localStorage.setItem("usuarioLogado", "true");
                localStorage.setItem("userToken", data.token);
                localStorage.setItem("usuarioNome", data.username);
                localStorage.setItem("usuarioNomeCompleto", data.nome);
                localStorage.setItem("usuarioEmail", data.email);
                localStorage.setItem("usuarioId", data.id);
                window.location.href = "/painel-admin";
            } else {
                erro.textContent = "Este usuário não tem permissão de administrador!";
            }
        } else {
            erro.textContent = data.error || "Email ou senha incorretos!";
        }
    } catch (e) {
        erro.textContent = "Erro de conexão com o servidor.";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const pessoaSenha = document.getElementById("pessoa-senha");
    if (pessoaSenha) {
        pessoaSenha.addEventListener("keydown", (e) => {
            if (e.key === "Enter") entrarComoPessoa();
        });
    }

    const adminSenha = document.getElementById("admin-senha");
    if (adminSenha) {
        adminSenha.addEventListener("keydown", (e) => {
            if (e.key === "Enter") entrarComoAdmin();
        });
    }

    const cadastroConfirmar = document.getElementById("cadastro-confirmar");
    if (cadastroConfirmar) {
        cadastroConfirmar.addEventListener("keydown", (e) => {
            if (e.key === "Enter") cadastrarUsuario();
        });
    }
});
