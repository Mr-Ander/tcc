function verificarLoginAdmin() {
    const logado = localStorage.getItem("adminLogado");
    if (!logado || logado !== "true") {
        window.location.href = "login.html";
    }
}

function sairAdmin() {
    localStorage.removeItem("adminLogado");
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    verificarLoginAdmin();
});
