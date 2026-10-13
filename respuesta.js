/* =========================================================
   CONFIG — edita SOLO esta parte para personalizar la página.
========================================================= */
const CONFIG = {
  // Su nombre
  nombre: "Jennifer",

  // El nombre de tu shih tzu
  nombrePerrita: "Copito",

  // Una palabra por flor del ramo (agrega o quita y el ramo se ajusta solo)
  palabras: [
    "Me haces el día",
    "Que suerte coincidir contigo",
    "Lindo verte sonreir",
    "Eres Increíble",
    "Eres mi pensamiento favorito del día",
    "Todos es mejor si estas tú",
    "Eres mi Inspiración para ser el mejor",
    "Eres Única",
    "Eres Maravillosa",
    "Eres Hermosa",
    "Me alegras la vida",
    "No te sales de mi cabeza",
    "Haces que todo valga la pena",
    "Pero ante todo eres alguien muy importante para mi",
    "Cada vez que sonrio es porque me llega un pensamiento tuyo",
  ],

  // El mensaje que aparece al recoger TODAS las flores.
  // Puedes usar {nombre} y {perrita} y se reemplazan automáticamente.
  mensajeFinal:
    "{nombre}, Te agradezco por ser mi motivación y una fuente de alegría para seguir adelante, tenerte en mi vida como siempre lo diré ha sido lo mejor que me ha pasado, me recuerdas que siempre se puede mejorar e ir por mas",
};

/* =========================================================
   A partir de aquí es lógica — no hace falta tocarlo.
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  aplicarNombres();
  construirRamo();
  iniciarPetalos();
  prepararFotos();
});

function conVariables(texto) {
  return texto
    .replaceAll("{nombre}", CONFIG.nombre)
    .replaceAll("{perrita}", CONFIG.nombrePerrita);
}

function aplicarNombres() {
  document.querySelectorAll('[data-slot="nombre"]').forEach((el) => {
    el.textContent = CONFIG.nombre;
  });
  document.querySelectorAll('[data-slot="perrita"]').forEach((el) => {
    el.textContent = CONFIG.nombrePerrita;
  });
}

/* ---- Construir el ramo a partir de CONFIG.palabras ---- */
function construirRamo() {
  const contenedor = document.getElementById("bouquet");
  if (!contenedor) return;

  CONFIG.palabras.forEach((palabra, index) => {
    const boton = document.createElement("button");
    boton.className = "flower";
    boton.dataset.index = index;
    boton.setAttribute("aria-label", "Recoger flor");
    boton.innerHTML = flowerSVG();
    contenedor.appendChild(boton);
  });

  contenedor.addEventListener("click", (evento) => {
    const flor = evento.target.closest(".flower");
    if (!flor || flor.classList.contains("is-picked")) return;
    recogerFlor(flor);
  });
}

function flowerSVG() {
  return `
    <svg class="flower__svg" viewBox="0 0 64 84" xmlns="http://www.w3.org/2000/svg">
      <line class="flower__stem" x1="32" y1="40" x2="32" y2="82" stroke-width="3" stroke-linecap="round"/>
      <g transform="translate(32,26)">
        <ellipse class="flower__petal" cx="0"   cy="-16" rx="8" ry="14"/>
        <ellipse class="flower__petal" cx="0"   cy="16"  rx="8" ry="14"/>
        <ellipse class="flower__petal" cx="-16" cy="0"   rx="14" ry="8"/>
        <ellipse class="flower__petal" cx="16"  cy="0"   rx="14" ry="8"/>
        <ellipse class="flower__petal" cx="-11" cy="-11" rx="9" ry="13" transform="rotate(45 -11 -11)"/>
        <ellipse class="flower__petal" cx="11"  cy="11"  rx="9" ry="13" transform="rotate(45 11 11)"/>
        <ellipse class="flower__petal" cx="-11" cy="11"  rx="9" ry="13" transform="rotate(-45 -11 11)"/>
        <ellipse class="flower__petal" cx="11"  cy="-11" rx="9" ry="13" transform="rotate(-45 11 -11)"/>
        <circle class="flower__center" r="9"/>
      </g>
    </svg>
  `;
}

/* ---- Al hacer clic en una flor ---- */
function recogerFlor(flor) {
  const index = Number(flor.dataset.index);
  const palabra = CONFIG.palabras[index];
  const revealWord = document.getElementById("revealWord");

  flor.classList.add("is-picked");

  if (revealWord) {
    revealWord.style.opacity = 0;
    setTimeout(() => {
      revealWord.textContent = palabra;
      revealWord.style.opacity = 1;
    }, 180);
  }

  const todasRecogidas = document.querySelectorAll(".flower:not(.is-picked)").length === 0;
  if (todasRecogidas) {
    setTimeout(mostrarMensajeFinal, 700);
  }
}

function mostrarMensajeFinal() {
  const hint = document.getElementById("bouquetHint");
  const seccionFinal = document.getElementById("finalSection");
  const mensaje = document.getElementById("finalMessage");

  if (hint) hint.textContent = "Recogiste todo el ramo.";
  if (mensaje) mensaje.textContent = conVariables(CONFIG.mensajeFinal);
  if (seccionFinal) {
    seccionFinal.hidden = false;
    seccionFinal.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* ---- Fotos: si aún no existe el archivo, muestra el marco vacío ---- */
function prepararFotos() {
  document.querySelectorAll(".photo-frame__img").forEach((img) => {
    img.addEventListener("error", () => {
      img.hidden = true;
    });
    // por si el navegador ya intentó cargarla antes de que se registre el listener
    if (img.complete && img.naturalWidth === 0) {
      img.hidden = true;
    }
  });
}

/* ---- Pétalos cayendo de fondo ---- */
function iniciarPetalos() {
  const contenedor = document.getElementById("petalsFall");
  if (!contenedor) return;

  function crearPetalo() {
    const petalo = document.createElement("div");
    petalo.className = "petal";
    petalo.style.left = Math.random() * 100 + "vw";
    const duracionCaida = 6 + Math.random() * 6;
    petalo.style.animationDuration = `${duracionCaida}s, ${2 + Math.random() * 2}s`;
    contenedor.appendChild(petalo);
    setTimeout(() => petalo.remove(), duracionCaida * 1000);
  }

  setInterval(crearPetalo, 900);
}
