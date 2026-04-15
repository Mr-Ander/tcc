(function(){
  const isAdmin = localStorage.getItem("adminLogado") === "true";
  let chatAberto = false;
  let nomeUsuario = localStorage.getItem("chatNome") || "";
  let streamChat = null;
  let cameraAberta = false;

  const estilos = document.createElement("link");
  estilos.rel = "stylesheet";
  estilos.href = "chat.css";
  document.head.appendChild(estilos);

  const toggle = document.createElement("button");
  toggle.id = "chat-toggle";
  toggle.title = "Chat Global";
  toggle.innerHTML = `&#128172;<span id="chat-badge"></span>`;
  document.body.appendChild(toggle);

  const box = document.createElement("div");
  box.id = "chat-box";
  box.innerHTML = `
    <div id="chat-header">
      <span>Chat Global</span>
      <span id="chat-online">ao vivo</span>
    </div>
    <div id="chat-nome-area" style="${nomeUsuario ? 'display:none' : ''}">
      <input id="chat-nome-input" placeholder="Seu nome para o chat..." maxlength="20">
    </div>
    <div id="chat-mensagens"><p id="chat-vazio">Nenhuma mensagem ainda</p></div>
    <div id="chat-camera-area" style="display:none">
      <video id="chat-video" autoplay playsinline></video>
      <div id="chat-camera-btns">
        <button id="chat-tirar-foto">Tirar Foto</button>
        <button id="chat-fechar-camera">Cancelar</button>
      </div>
    </div>
    <canvas id="chat-canvas" style="display:none"></canvas>
    <div id="chat-preview-area" style="display:none">
      <img id="chat-preview-img">
      <div id="chat-preview-btns">
        <button id="chat-enviar-foto">Enviar Foto</button>
        <button id="chat-descartar-foto">Descartar</button>
      </div>
    </div>
    <div id="chat-input-area">
      <button id="chat-btn-foto" title="Enviar foto">&#128247;</button>
      <button id="chat-btn-camera" title="Tirar foto pela c\u00e2mera">&#127909;</button>
      <input id="chat-input" placeholder="Escreva uma mensagem..." maxlength="300">
      <button id="chat-enviar">Enviar</button>
    </div>
    <input type="file" id="chat-file-input" accept="image/*" style="display:none">
  `;
  document.body.appendChild(box);

  toggle.addEventListener("click", function(){
    chatAberto = !chatAberto;
    box.style.display = chatAberto ? "flex" : "none";
    if(chatAberto){
      document.getElementById("chat-badge").style.display = "none";
      renderMensagens();
      if(nomeUsuario){
        document.getElementById("chat-input").focus();
      } else {
        document.getElementById("chat-nome-input").focus();
      }
    } else {
      fecharCameraChat();
    }
  });

  document.getElementById("chat-nome-input").addEventListener("keydown", function(e){
    if(e.key === "Enter"){
      const val = this.value.trim();
      if(val.length < 2){ alert("Nome muito curto!"); return; }
      nomeUsuario = val;
      localStorage.setItem("chatNome", nomeUsuario);
      document.getElementById("chat-nome-area").style.display = "none";
      document.getElementById("chat-input").focus();
    }
  });

  document.getElementById("chat-enviar").addEventListener("click", enviarMensagem);
  document.getElementById("chat-input").addEventListener("keydown", function(e){
    if(e.key === "Enter") enviarMensagem();
  });

  document.getElementById("chat-btn-foto").addEventListener("click", function(){
    if(!verificarNome()) return;
    document.getElementById("chat-file-input").click();
  });

  document.getElementById("chat-file-input").addEventListener("change", function(e){
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(ev){
      mostrarPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
    this.value = "";
  });

  document.getElementById("chat-btn-camera").addEventListener("click", function(){
    if(!verificarNome()) return;
    abrirCameraChat();
  });

  document.getElementById("chat-tirar-foto").addEventListener("click", function(){
    const video = document.getElementById("chat-video");
    const canvas = document.getElementById("chat-canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const foto = canvas.toDataURL("image/jpeg", 0.7);
    fecharCameraChat();
    mostrarPreview(foto);
  });

  document.getElementById("chat-fechar-camera").addEventListener("click", fecharCameraChat);

  document.getElementById("chat-enviar-foto").addEventListener("click", function(){
    const img = document.getElementById("chat-preview-img").src;
    if(!img) return;
    salvarMensagem("", img);
    document.getElementById("chat-preview-area").style.display = "none";
    document.getElementById("chat-preview-img").src = "";
    document.getElementById("chat-input-area").style.display = "flex";
  });

  document.getElementById("chat-descartar-foto").addEventListener("click", function(){
    document.getElementById("chat-preview-area").style.display = "none";
    document.getElementById("chat-preview-img").src = "";
    document.getElementById("chat-input-area").style.display = "flex";
  });

  function verificarNome(){
    if(!nomeUsuario){
      const val = document.getElementById("chat-nome-input").value.trim();
      if(val.length < 2){ alert("Digite seu nome primeiro!"); return false; }
      nomeUsuario = val;
      localStorage.setItem("chatNome", nomeUsuario);
      document.getElementById("chat-nome-area").style.display = "none";
    }
    return true;
  }

  function abrirCameraChat(){
    document.getElementById("chat-camera-area").style.display = "flex";
    document.getElementById("chat-input-area").style.display = "none";
    cameraAberta = true;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then(function(s){
        streamChat = s;
        document.getElementById("chat-video").srcObject = s;
      })
      .catch(function(){
        alert("Não foi possível acessar a câmera.");
        fecharCameraChat();
      });
  }

  function fecharCameraChat(){
    if(streamChat){
      streamChat.getTracks().forEach(function(t){ t.stop(); });
      streamChat = null;
    }
    cameraAberta = false;
    document.getElementById("chat-camera-area").style.display = "none";
    document.getElementById("chat-input-area").style.display = "flex";
  }

  function mostrarPreview(src){
    document.getElementById("chat-input-area").style.display = "none";
    document.getElementById("chat-preview-img").src = src;
    document.getElementById("chat-preview-area").style.display = "flex";
  }

  function enviarMensagem(){
    if(!verificarNome()) return;
    const input = document.getElementById("chat-input");
    const texto = input.value.trim();
    if(!texto) return;
    salvarMensagem(texto, "");
    input.value = "";
  }

  function salvarMensagem(texto, foto){
    const msgs = JSON.parse(localStorage.getItem("chatMensagens")) || [];
    msgs.push({
      id: Date.now(),
      autor: nomeUsuario,
      texto: texto,
      foto: foto,
      hora: new Date().toLocaleTimeString("pt-br", {hour:"2-digit", minute:"2-digit"})
    });
    localStorage.setItem("chatMensagens", JSON.stringify(msgs));
    renderMensagens();
  }

  function renderMensagens(){
    const container = document.getElementById("chat-mensagens");
    const msgs = JSON.parse(localStorage.getItem("chatMensagens")) || [];

    if(msgs.length === 0){
      container.innerHTML = `<p id="chat-vazio">Nenhuma mensagem ainda</p>`;
      return;
    }

    container.innerHTML = "";
    msgs.forEach(function(msg){
      const div = document.createElement("div");
      div.className = "chat-msg";
      div.dataset.id = msg.id;

      let conteudo = "";
      if(msg.foto){
        conteudo = `<img class="msg-foto" src="${msg.foto}" alt="foto">`;
      } else {
        conteudo = `<div class="msg-texto">${sanitizar(msg.texto)}</div>`;
      }

      div.innerHTML = `
        <div class="msg-autor">${sanitizar(msg.autor)}</div>
        ${conteudo}
        <div class="msg-hora">${msg.hora}</div>
        ${isAdmin ? `<button class="msg-apagar" title="Apagar" onclick="window._chatApagarMsg(${msg.id})">&#10005;</button>` : ""}
      `;
      if(isAdmin){
        div.querySelector(".msg-apagar").style.display = "block";
      }
      container.appendChild(div);
    });
    container.scrollTop = container.scrollHeight;
  }

  function sanitizar(str){
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  window._chatApagarMsg = function(id){
    let msgs = JSON.parse(localStorage.getItem("chatMensagens")) || [];
    msgs = msgs.filter(function(m){ return m.id !== id; });
    localStorage.setItem("chatMensagens", JSON.stringify(msgs));
    renderMensagens();
  };

  setInterval(function(){
    if(chatAberto && !cameraAberta) renderMensagens();
  }, 3000);
})();
