function verificarLoginAdmin() {
    const logado = localStorage.getItem("adminLogado");
    if (!logado || logado !== "true") {
        window.location.href = "/login";
    }
}

function sairAdmin() {
    localStorage.removeItem("adminLogado");
    window.location.href = "/login";
}

document.addEventListener("DOMContentLoaded", () => {
    verificarLoginAdmin();
});
