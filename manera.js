/* =========================================================
   CONFIG — edita SOLO esta parte para personalizar la página.
========================================================= */
const CONFIG = {
  nombre: "Jennifer", // tu nombre, se reemplaza en los textos donde aparece {nombre}

  // Texto bajo la gráfica cuando termina de dibujarse.
  // Puedes usar {nombre} y se reemplaza solo.
  mensajeGrafica: "Comprobado: siempre da corazón.",

  // Mensaje bajo la foto de ambos
  mensajeJuntos:
    "De todas las curvas que existen, esta es mi favorita. " +
    "Y la segunda es la de tu sonrisa, {nombre}.",
};

/* =========================================================
   A partir de aquí es lógica — no hace falta tocarlo.
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  aplicarTextos();
  dibujarCorazon();
  prepararFoto();
});

function conNombre(texto) {
  return texto.replaceAll("{nombre}", CONFIG.nombre);
}

function aplicarTextos() {
  const mensaje = document.getElementById("togetherMessage");
  if (mensaje) mensaje.textContent = conNombre(CONFIG.mensajeJuntos);
}

/* ---- Calcula los puntos de x² + (y - ∛(x²))² = 1 ---- */
function puntosCorazon(pasos = 200) {
  const puntos = [];

  // rama de arriba: y = ∛(x²) + √(1 - x²)
  for (let i = 0; i <= pasos; i++) {
    const x = -1 + (2 * i) / pasos;
    const y = Math.cbrt(x * x) + Math.sqrt(Math.max(0, 1 - x * x));
    puntos.push([x, y]);
  }
  // rama de abajo (de vuelta): y = ∛(x²) - √(1 - x²)
  for (let i = 0; i <= pasos; i++) {
    const x = 1 - (2 * i) / pasos;
    const y = Math.cbrt(x * x) - Math.sqrt(Math.max(0, 1 - x * x));
    puntos.push([x, y]);
  }

  return puntos;
}

function construirPathD(puntos) {
  // el eje Y del SVG crece hacia abajo, por eso se invierte el signo de "y"
  return puntos
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(4)},${(-y).toFixed(4)}`)
    .join(" ") + " Z";
}

function dibujarCorazon() {
  const path = document.getElementById("heartPath");
  const boton = document.getElementById("graphBtn");
  const caption = document.getElementById("plotCaption");
  if (!path) return;

  path.setAttribute("d", construirPathD(puntosCorazon()));

  function animarTrazo() {
    const largo = path.getTotalLength();
    path.classList.remove("is-filled");
    path.style.transition = "none";
    path.style.strokeDasharray = largo;
    path.style.strokeDashoffset = largo;
    if (caption) caption.textContent = "";

    // fuerza un reflow para que el próximo cambio sí anime
    path.getBoundingClientRect();

    path.style.transition = "stroke-dashoffset 2.1s ease";
    path.style.strokeDashoffset = 0;

    setTimeout(() => {
      path.classList.add("is-filled");
      if (caption) caption.textContent = conNombre(CONFIG.mensajeGrafica);
    }, 2100);
  }

  // se dibuja solo la primera vez que entra en pantalla
  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        animarTrazo();
        observer.disconnect();
      });
    },
    { threshold: 0.5 }
  );
  observer.observe(document.getElementById("heartSvg"));

  if (boton) boton.addEventListener("click", animarTrazo);
}

/* ---- Foto de los dos: si no existe el archivo, muestra el marco vacío ---- */
function prepararFoto() {
  document.querySelectorAll(".photo-frame__img").forEach((img) => {
    img.addEventListener("error", () => {
      img.hidden = true;
    });
    if (img.complete && img.naturalWidth === 0) {
      img.hidden = true;
    }
  });
}
