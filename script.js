/* =========================================================
   CONFIG — edita SOLO esta parte para personalizar la página.
   No necesitas tocar nada más abajo.
========================================================= */
const CONFIG = {
  // El nombre que aparece en el hero (data-slot="nombre")
  nombre: "Jennifer",

  // Barras de "estadísticas" — label + valor final (0-100)
  stats: [
    { label: "Constancia y Dedicación", value: 100 },
    { label: "Corazón y Valores",     value: 100 },
    { label: "Actitud e Inteligencia",    value: 100 },
    {label: "Belleza y Alegria",    value: 100 },
  ],

  // Frases que van rotando en el tablero. Puedes agregar o quitar las que quieras.
  // Usa {nombre} en cualquier frase y se reemplaza automáticamente.
    frases: [
    "{nombre} No sé qué me hiciste, pero te volviste mi pensamiento favorito del día .",
    "Tienes un no sé qué que me encanta y no cambio por nada .",
    "Haces que cualquier lugar se sienta como estar en casa {nombre}.",
    "Gracias por ser esa luz que me motiva a ir siempre por mas .",
    "Contigo siempre es un buen momento para coincidir.",
    "{nombre}: No solo me alegras los días, me haces querer ser mi mejor version.",
  ],

  // Mensajes que aparecen al llegar a ciertos números de "reps"
  hitos: {
    10: "Vas calentando.",
    25: "Ahí vamos, ese es el ritmo.",
    50: "Wow. En serio wow.",
    100: "Ok, oficialmente eres imparable.",
    200: "Llegaste al limite",
  },
};

/* =========================================================
   A partir de aquí es lógica — no hace falta tocarlo.
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  aplicarNombre();
  construirStats();
  iniciarFrases();
  iniciarContadorReps();
});

/* ---- Nombre en el hero ---- */
function aplicarNombre() {
  document.querySelectorAll('[data-slot="nombre"]').forEach((el) => {
    el.textContent = CONFIG.nombre;
  });
  document.title = `Para ${CONFIG.nombre}`;
}

function conNombre(texto) {
  return texto.replaceAll("{nombre}", CONFIG.nombre);
}

/* ---- Barras de stats (se animan al entrar en pantalla) ---- */
function construirStats() {
  const contenedor = document.getElementById("statList");
  if (!contenedor) return;

  CONFIG.stats.forEach((stat) => {
    const fila = document.createElement("div");
    fila.className = "stat-row";
    fila.innerHTML = `
      <span class="stat-row__label">${stat.label}</span>
      <span class="stat-row__track">
        <span class="stat-row__fill" data-value="${stat.value}"></span>
      </span>
      <span class="stat-row__value">0%</span>
    `;
    contenedor.appendChild(fila);
  });

  const filas = contenedor.querySelectorAll(".stat-row");

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        const fill = entrada.target.querySelector(".stat-row__fill");
        const valorEl = entrada.target.querySelector(".stat-row__value");
        const objetivo = Number(fill.dataset.value);

        fill.style.width = objetivo + "%";
        animarNumero(valorEl, objetivo);

        observer.unobserve(entrada.target);
      });
    },
    { threshold: 0.4 }
  );

  filas.forEach((fila) => observer.observe(fila));
}

function animarNumero(el, objetivo) {
  const duracion = 1200;
  const inicio = performance.now();

  function paso(ahora) {
    const progreso = Math.min((ahora - inicio) / duracion, 1);
    const valorActual = Math.round(progreso * objetivo);
    el.textContent = valorActual + "%";
    if (progreso < 1) requestAnimationFrame(paso);
  }
  requestAnimationFrame(paso);
}

/* ---- Frases del tablero ---- */
function iniciarFrases() {
  const texto = document.getElementById("quoteText");
  const boton = document.getElementById("quoteBtn");
  if (!texto || !boton) return;

  let ultimaIndex = -1;

  function mostrarFraseAleatoria() {
    let index;
    do {
      index = Math.floor(Math.random() * CONFIG.frases.length);
    } while (index === ultimaIndex && CONFIG.frases.length > 1);

    ultimaIndex = index;
    texto.style.opacity = 0;

    setTimeout(() => {
      texto.textContent = conNombre(CONFIG.frases[index]);
      texto.style.opacity = 1;
    }, 180);
  }

  texto.style.transition = "opacity 0.18s ease";
  mostrarFraseAleatoria();
  boton.addEventListener("click", mostrarFraseAleatoria);
}

/* ---- Contador de reps / reto ---- */
function iniciarContadorReps() {
  const numeroEl = document.getElementById("repNumber");
  const boton = document.getElementById("repBtn");
  const mensajeEl = document.getElementById("repMsg");
  const platosEl = document.getElementById("repPlates");
  if (!numeroEl || !boton) return;

  let reps = 0;

  boton.addEventListener("click", () => {
    reps += 1;
    numeroEl.textContent = reps;

    // cada 5 reps "cae" una placa nueva a la barra visual
    if (reps % 5 === 0) {
      const placa = document.createElement("div");
      placa.className = "rep-counter__plate";
      platosEl.appendChild(placa);
    }

    if (CONFIG.hitos[reps]) {
      mensajeEl.textContent = conNombre(CONFIG.hitos[reps]);
    }
  });
}
