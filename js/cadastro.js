let fotoBase64 = "";
let stream = null;

document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("usuarioLogado")) {
        window.location.href = "/login";
    }
});

function voltar() {
    window.location.href = "/";
}

function usarArquivo() {
    document.getElementById("inputArquivo").click();
}

function previewArquivo(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        fotoBase64 = e.target.result;
        const preview = document.getElementById("preview");
        preview.src = fotoBase64;
        preview.style.display = "block";
    };
    reader.readAsDataURL(file);
}

function abrirCamera() {
    const cameraArea = document.getElementById("cameraArea");
    cameraArea.style.display = "block";
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
        .then(function(s) {
            stream = s;
            document.getElementById("video").srcObject = s;
        })
        .catch(function() {
            alert("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
            cameraArea.style.display = "none";
        });
}

function tirarFoto() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    fotoBase64 = canvas.toDataURL("image/jpeg");
    const preview = document.getElementById("preview");
    preview.src = fotoBase64;
    preview.style.display = "block";
    fecharCamera();
}

function fecharCamera() {
    if (stream) {
        stream.getTracks().forEach(t => t.stop());
        stream = null;
    }
    document.getElementById("cameraArea").style.display = "none";
}

async function salvarPlanta() {
    if (!localStorage.getItem("usuarioLogado")) {
        alert("Você precisa fazer login para cadastrar uma planta!");
        window.location.href = "/login";
        return;
    }

    const nome = document.getElementById("nome").value.trim();
    const especie = document.getElementById("especie").value.trim();
    const categoria = document.getElementById("categoria").value;
    const local = document.getElementById("local").value.trim();
    const observacoes = document.getElementById("observacoes").value.trim();
    const usuario_id = localStorage.getItem("usuarioId");

    if (nome === "" || especie === "") {
        alert("Preencha os campos obrigatórios (Nome e Espécie)!");
        return;
    }

    try {
        const response = await authenticatedFetch(`${API_URL}/plantas`, {
            method: 'POST',
            body: JSON.stringify({
                nome,
                especie,
                categoria,
                local_encontro: local,
                observacoes,
                foto: fotoBase64
            })
        });

        if (response && response.ok) {
            alert("Planta enviada para aprovação do administrador!");
            window.location.href = "/";
        } else {
            const data = await response.json();
            alert(data.error || "Erro ao salvar planta.");
        }
    } catch (e) {
        alert("Erro de conexão com o servidor.");
    }
}
