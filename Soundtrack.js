/* =========================================================
   CONFIG — agrega aquí todas las canciones que quieras.
   "archivo" es la ruta DENTRO de tu carpeta static/audio/
   "portada" es opcional (ruta dentro de static/); si no existe
   el archivo, el disco se queda con el color sólido, sin romperse.
========================================================= */
const CONFIG = {
  canciones: [
    {
      titulo: "Si Hay Algo",
      artista: "Jósean Log",
      archivo: "Si hay algo que pueda yo hacer para que te enamores Jósean Log - Si Hay Algo (letra).mp3",
    },
    {
      titulo: "Cómo Expresar Lo Que Siento",
      artista: "Binomio De Oro",
      archivo: "Cómo Expresar Lo Que Siento, Binomio De Oro De América, Video Letra - Sentir Vallenato.mp3",
    },
    {
      titulo: "Diez Razones Para Amarte",
      artista: "Martín Elías",
      archivo: "Diez Razones Para Amarte, El Gran Martín Elías, Video Letra - Sentir Vallenato.mp3",
    },
    {
      titulo: "Día Tras Día",
      artista: "Andres Cepeda",
      archivo: "Andres Cepeda - Día Tras Día (Videos Oficiales).mp3",
    },
    {
      titulo: "Tu Eres Ajena",
      artista: "Eddy Herrera",
      archivo: "EDDY HERRERA - Tú Eres Ajena (Letra) me rompiste el corazón, jugaste con mi amor... 💔.mp3",
    },
    {
      titulo: "Doma",
      artista: "Jósean Log",
      archivo: "Jósean Log - Doma (Lyric Video).mp3",
    },
    {
      titulo: "OHNANA",
      artista: "Kapo",
      archivo: "Kapo - OHNANA.mp3",
    },
    {
      titulo: "Donde",
      artista: "Kapo, Ryan Castro",
      archivo: "Kapo, Ryan Castro - Donde (Letra).mp3",
    },
    {
      titulo: "La Forma En La Que Me Miras",
      artista: "Super Yei*Myke Towers*Sammy*Lenny Tavarez*Rafa Pabón*Jone Quest",
      archivo: "La forma en que me miras - Super Yei x Myke Towers x Sammy x Lenny Tavarez x Rafa Pabon x Jone Quest.mp3",
    },
    {
      titulo: "Mi Primer Amor",
      artista: "Luis Mateus",
      archivo: "Mi Primer Amor, Luis Mateus, Conjunto Sentir Vallenato - Video.mp3",
    },
    {
      titulo: "Pense Em Mim",
      artista: "Leandro & Leonardo y continental",
      archivo: "mike wazowski cantando pense em mim Leandro & Leonardo y Continental - Pense em mim (Letra Lyrics).mp3",
    },
    {
      titulo: "Love Buzz",
      artista: "Nirvana",
      archivo: "Nirvana - Love Buzz (Live At The Paramount, Seattle 1991).mp3",
    },
    {
      titulo: "No Pude Olvidarte",
      artista: "Binomio De Oro",
      archivo: "No Pude Olvidarte, Binomio De Oro De América, Video Letra - Sentir Vallenato.mp3",
    },
    {
      titulo: "Que Carita Tan Bonita",
      artista: "Urboi",
      archivo: "Que carita tan bonita ♡ncion4.mp3",
    },
    {
      titulo: "Propuesta Indecente",
      artista: "Romeo Santos",
      archivo: "Romeo Santos - Propuesta Indecente (Official Video).mp3",
    },
    {
      titulo: "Dardos",
      artista: "Romeo Santos, Prince Royce",
      archivo: "Romeo Santos, Prince Royce - Dardos (Official Lyric Video).mp3",
    },
    {
      titulo: "Solo Por Un Beso",
      artista: "Aventura",
      archivo: "Solo por un beso - Aventura (letra).mp3",
    },
    {
      titulo: "Until I Found You",
      artista: "Stephen Sanchez",
      archivo: "Stephen Sanchez - Until I Found You (Lyrics).mp3",
    },
    {
      titulo: "Un Beso De Tu Boca",
      artista: "Silvestre Dangond",
      archivo: "Un Beso de Tu Boca - Silvestre Dangond (Letra).mp3",
    },
    {
      titulo: "Un Perro Enamorado",
      artista: "Yeison Jiménez",
      archivo: "Yeison Jimenez - Un Perro Enamorado (Letra Oficial).mp3",
    },
    {
      titulo: "La Boda",
      artista: "Kendo Kaponi y Neil",
      archivo: "11. Cosculluela Ft. O'Neill Y Kendo Kaponi - La Boda - Reggaeton Mundial (128k).mp3",
    },
    {
      titulo: "Un Millón De Primaveras",
      artista: "Vicente Fernández",
      archivo: "Vicente Fernández - Un Millón de Primaveras (Letra) - magnificent (128k).mp3",
    },
    // Agrega más así, una por una. No hay límite de cantidad:
    // { titulo: "...", artista: "...", archivo: "....mp3", portada: "" },
  ],
};

/* =========================================================
   A partir de aquí es lógica — no hace falta tocarlo.
========================================================= */
let indiceActual = -1;

const audio = document.getElementById("audioPlayer");
const playlistEl = document.getElementById("playlist");
const discEl = document.getElementById("disc");
const discImgEl = document.getElementById("discImg");
const tituloEl = document.getElementById("trackTitle");
const artistaEl = document.getElementById("trackArtist");
const equalizerEl = document.getElementById("equalizer");

const playBtn = document.getElementById("playBtn");
const iconPlay = document.getElementById("iconPlay");
const iconPause = document.getElementById("iconPause");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const seekBar = document.getElementById("seekBar");
const currentTimeEl = document.getElementById("currentTime");
const durationTimeEl = document.getElementById("durationTime");
const volumeBar = document.getElementById("volumeBar");

document.addEventListener("DOMContentLoaded", () => {
  if (!audio || !playlistEl) return;
  renderPlaylist();
  conectarControles();
  audio.volume = Number(volumeBar.value) / 100;
});

/* ---- Construir la lista a partir de CONFIG.canciones ---- */
function renderPlaylist() {
  CONFIG.canciones.forEach((cancion, index) => {
    const fila = document.createElement("button");
    fila.className = "track-row";
    fila.dataset.index = index;
    fila.innerHTML = `
      <span class="track-row__num">${index + 1}</span>
      <span class="track-row__meta">
        <span class="track-row__title">${cancion.titulo}</span>
        <span class="track-row__artist">${cancion.artista}</span>
      </span>
    `;
    playlistEl.appendChild(fila);
  });

  playlistEl.addEventListener("click", (evento) => {
    const fila = evento.target.closest(".track-row");
    if (!fila) return;
    cargarCancion(Number(fila.dataset.index), true);
  });
}

/* ---- Cargar y (opcionalmente) reproducir una canción ---- */
function cargarCancion(index, autoplay) {
  const cancion = CONFIG.canciones[index];
  if (!cancion) return;

  indiceActual = index;
  audio.src = encodeURI(cancion.archivo);

  tituloEl.textContent = cancion.titulo;
  artistaEl.textContent = cancion.artista;

  if (cancion.portada) {
    discImgEl.src = encodeURI(cancion.portada);
    discImgEl.hidden = false;
    discImgEl.onerror = () => { discImgEl.hidden = true; };
  } else {
    discImgEl.hidden = true;
  }

  document.querySelectorAll(".track-row").forEach((fila) => {
    fila.classList.toggle("is-active", Number(fila.dataset.index) === index);
  });

  seekBar.value = 0;
  seekBar.style.setProperty("--progress", "0%");
  currentTimeEl.textContent = "0:00";
  durationTimeEl.textContent = "0:00";

  if (autoplay) {
    audio.play().catch(() => {
      // el navegador bloqueó el autoplay; el usuario deberá darle play manualmente
      actualizarEstadoBoton(false);
    });
  }
}

/* ---- Reproducir / pausar ---- */
function alternarReproduccion() {
  if (indiceActual === -1) {
    if (CONFIG.canciones.length > 0) cargarCancion(0, true);
    return;
  }
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function actualizarEstadoBoton(reproduciendo) {
  iconPlay.hidden = reproduciendo;
  iconPause.hidden = !reproduciendo;
  playBtn.setAttribute("aria-label", reproduciendo ? "Pausar" : "Reproducir");
  discEl.classList.toggle("is-playing", reproduciendo);
  equalizerEl.classList.toggle("is-active", reproduciendo);
}

/* ---- Siguiente / anterior (con vuelta al principio/final) ---- */
function siguienteCancion() {
  if (CONFIG.canciones.length === 0) return;
  const siguiente = (indiceActual + 1) % CONFIG.canciones.length;
  cargarCancion(siguiente, true);
}

function cancionAnterior() {
  if (CONFIG.canciones.length === 0) return;
  const anterior = (indiceActual - 1 + CONFIG.canciones.length) % CONFIG.canciones.length;
  cargarCancion(anterior, true);
}

/* ---- Conectar todos los controles ---- */
function conectarControles() {
  playBtn.addEventListener("click", alternarReproduccion);
  nextBtn.addEventListener("click", siguienteCancion);
  prevBtn.addEventListener("click", cancionAnterior);

  audio.addEventListener("play", () => actualizarEstadoBoton(true));
  audio.addEventListener("pause", () => actualizarEstadoBoton(false));
  audio.addEventListener("ended", siguienteCancion);

  audio.addEventListener("loadedmetadata", () => {
    durationTimeEl.textContent = formatearTiempo(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    const porcentaje = (audio.currentTime / audio.duration) * 100;
    seekBar.value = porcentaje;
    seekBar.style.setProperty("--progress", porcentaje + "%");
    currentTimeEl.textContent = formatearTiempo(audio.currentTime);
  });

  audio.addEventListener("error", () => {
    artistaEl.textContent = "No se pudo cargar esta canción";
  });

  seekBar.addEventListener("input", () => {
    if (!audio.duration) return;
    audio.currentTime = (Number(seekBar.value) / 100) * audio.duration;
  });

  volumeBar.addEventListener("input", () => {
    audio.volume = Number(volumeBar.value) / 100;
  });
}

function formatearTiempo(segundos) {
  if (!isFinite(segundos)) return "0:00";
  const min = Math.floor(segundos / 60);
  const seg = Math.floor(segundos % 60)
    .toString()
    .padStart(2, "0");
  return `${min}:${seg}`;
}
