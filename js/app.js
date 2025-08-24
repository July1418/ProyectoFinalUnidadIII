// ===============================
// Lista de palabras ofensivas
// ===============================
const palabrasOfensivas = ["boba", "idiota", "pendejo", "pendeja", "estupido", "estupida", "perra", "perro"];

// Validar si un texto contiene palabras ofensivas (usando regex para detectar palabras completas)
function validarRespuesta(texto) {
  const textoMinusculas = texto.toLowerCase();
  for (let palabra of palabrasOfensivas) {
    const regex = new RegExp("\\b" + palabra.toLowerCase() + "\\b", "i");
    if (regex.test(textoMinusculas)) {
      return false; // contiene palabra ofensiva
    }
  }
  return true; // está limpia
}

// ===============================
// Guardar un nuevo mensaje
// ===============================
function guardarMensaje(alias, categoria, mensaje) {
  if (!validarRespuesta(mensaje)) {
    alert("🚫 Tu mensaje contiene palabras ofensivas y no puede ser enviado.");
    return;
  }

  const mensajes = JSON.parse(localStorage.getItem("mensajes")) || [];
  const nuevo = {
    alias,
    categoria,
    mensaje,
    fecha: new Date().toLocaleString(),
    respuestas: [] // inicializamos vacío
  };
  mensajes.push(nuevo);
  localStorage.setItem("mensajes", JSON.stringify(mensajes));
  mostrarMensajes(); // refresca sin recargar
}

// ===============================
// Mostrar todos los mensajes
// ===============================
function mostrarMensajes() {
  const contenedor = document.getElementById("mensajes-lista");
  const mensajes = JSON.parse(localStorage.getItem("mensajes")) || [];

  if (!contenedor) return; // seguridad por si no existe el div

  if (mensajes.length === 0) {
    contenedor.innerHTML =
      '<p class="text-center">Aún no hay mensajes. Sé el primero en compartir 💌</p>';
    return;
  }

  contenedor.innerHTML = mensajes
    .map(
      (msg, index) => `
    <div class="col-md-6 mb-3">
      <div class="card p-3 shadow-sm">
        <h5 class="fw-bold">${msg.alias} <small class="text-muted">(${msg.categoria})</small></h5>
        <p>${msg.mensaje}</p>
        <small class="text-muted">Enviado: ${msg.fecha}</small>

        <!-- Botones para mensaje -->
        <div class="mt-2">
          <button class="btn btn-sm btn-warning" onclick="editarMensaje(${index})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="eliminarMensaje(${index})">Eliminar</button>
        </div>
        
        <!-- Respuestas -->
        <div class="mt-3" id="respuestas-${index}">
          ${
            (msg.respuestas && msg.respuestas.length > 0)
              ? msg.respuestas
                  .map(
                    (resp, rIndex) => `
            <div class="border rounded p-2 mb-2">
              <h6 class="fw-bold">${resp.alias}</h6>
              <p>${resp.texto}</p>
              <small class="text-muted">${resp.fecha}</small>
              <div class="mt-2">
                <button class="btn btn-sm btn-warning" onclick="editarRespuesta(${index}, ${rIndex})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarRespuesta(${index}, ${rIndex})">Eliminar</button>
              </div>
            </div>
          `
                  )
                  .join("")
              : '<p class="text-muted">No hay respuestas aún</p>'
          }
        </div>

        <!-- Formulario de respuesta con alias -->
        <div class="input-group mt-3">
          <input type="text" id="alias-respuesta-${index}" class="form-control" placeholder="Tu alias...">
          <input type="text" id="respuesta-${index}" class="form-control" placeholder="Escribe una respuesta...">
          <button class="btn btn-primary" onclick="responder(${index})">Responder</button>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// ===============================
// Responder a un mensaje (con alias obligatorio)
// ===============================
function responder(index) {
  const aliasInput = document.getElementById(`alias-respuesta-${index}`);
  const input = document.getElementById(`respuesta-${index}`);
  const alias = aliasInput.value.trim();
  const texto = input.value.trim();

  if (alias === "" || texto === "") return;

  // Validación de palabras ofensivas
  if (!validarRespuesta(texto)) {
    alert("🚫 Tu respuesta contiene palabras ofensivas y no puede ser enviada.");
    return;
  }

  const mensajes = JSON.parse(localStorage.getItem("mensajes")) || [];
  const respuesta = {
    alias,
    texto,
    fecha: new Date().toLocaleString(),
  };

  if (!mensajes[index].respuestas) {
    mensajes[index].respuestas = [];
  }

  mensajes[index].respuestas.push(respuesta);

  localStorage.setItem("mensajes", JSON.stringify(mensajes));
  aliasInput.value = "";
  input.value = "";
  mostrarMensajes(); // refresca inmediatamente
}

// ===============================
// Editar mensaje
// ===============================
function editarMensaje(index) {
  const mensajes = JSON.parse(localStorage.getItem("mensajes")) || [];
  const nuevoTexto = prompt("Edita tu mensaje:", mensajes[index].mensaje);

  if (nuevoTexto !== null && nuevoTexto.trim() !== "") {
    if (!validarRespuesta(nuevoTexto)) {
      alert("🚫 Tu mensaje editado contiene palabras ofensivas y no puede ser guardado.");
      return;
    }
    mensajes[index].mensaje = nuevoTexto;
    mensajes[index].fecha = new Date().toLocaleString();
    localStorage.setItem("mensajes", JSON.stringify(mensajes));
    mostrarMensajes();
  }
}

// ===============================
// Eliminar mensaje
// ===============================
function eliminarMensaje(index) {
  const mensajes = JSON.parse(localStorage.getItem("mensajes")) || [];
  mensajes.splice(index, 1);
  localStorage.setItem("mensajes", JSON.stringify(mensajes));
  mostrarMensajes();
}

// ===============================
// Editar respuesta
// ===============================
function editarRespuesta(msgIndex, respIndex) {
  const mensajes = JSON.parse(localStorage.getItem("mensajes")) || [];
  const nuevaRespuesta = prompt(
    "Edita tu respuesta:",
    mensajes[msgIndex].respuestas[respIndex].texto
  );

  if (nuevaRespuesta !== null && nuevaRespuesta.trim() !== "") {
    if (!validarRespuesta(nuevaRespuesta)) {
      alert("🚫 Tu respuesta editada contiene palabras ofensivas y no puede ser guardada.");
      return;
    }
    mensajes[msgIndex].respuestas[respIndex].texto = nuevaRespuesta;
    mensajes[msgIndex].respuestas[respIndex].fecha =
      new Date().toLocaleString();
    localStorage.setItem("mensajes", JSON.stringify(mensajes));
    mostrarMensajes();
  }
}

// ===============================
// Eliminar respuesta
// ===============================
function eliminarRespuesta(msgIndex, respIndex) {
  const mensajes = JSON.parse(localStorage.getItem("mensajes")) || [];
  mensajes[msgIndex].respuestas.splice(respIndex, 1);
  localStorage.setItem("mensajes", JSON.stringify(mensajes));
  mostrarMensajes();
}

// ===============================
// Inicializar al cargar la página
// ===============================
document.addEventListener("DOMContentLoaded", mostrarMensajes);
