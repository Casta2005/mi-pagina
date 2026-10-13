/* =========================================================
   MENÚ — se inserta solo en todas las páginas.
   Para agregar una página nueva: añade una línea en PAGINAS.
========================================================= */
const PAGINAS = [
  { archivo: "index.html",      texto: "Gym",               id: "GymLink" },
  { archivo: "respuesta.html",  texto: "¿Cómo soy yo?",     id: "RespuestaLink" },
  { archivo: "manera.html",     texto: "Amar a mi manera",  id: "ManeraLink" },
  { archivo: "Soundtrack.html", texto: "Nuestro Soundtrack", id: "SoundtrackLink" },
  { archivo: "galaxia.html",    texto: "Nuestra galaxia",   id: "GalaxiaLink" },
];

function construirMenu() {
  // archivo actual (si la URL termina en "/" se asume index.html)
  const actual = location.pathname.split("/").pop() || "index.html";

  const items = PAGINAS.map((p) => `
    <li>
      <a href="${p.archivo}" class="side-menu__link${p.archivo === actual ? " is-active" : ""}" id="${p.id}">
        ${p.texto}
      </a>
    </li>`).join("");

  document.body.insertAdjacentHTML("afterbegin", `
    <button class="menu-toggle" id="menuToggle" aria-expanded="false" aria-controls="sideMenu" aria-label="Abrir menú">
      <span class="menu-toggle__bar"></span>
      <span class="menu-toggle__bar"></span>
      <span class="menu-toggle__bar"></span>
    </button>

    <div class="menu-overlay" id="menuOverlay"></div>

    <nav class="side-menu" id="sideMenu" aria-hidden="true">
      <button class="side-menu__close" id="menuClose" aria-label="Cerrar menú">&times;</button>
      <p class="side-menu__title">Ir a</p>
      <ul class="side-menu__list">${items}
      </ul>
    </nav>
  `);
}

document.addEventListener("DOMContentLoaded", () => {
  construirMenu();

  const toggle = document.getElementById("menuToggle");
  const cerrarBtn = document.getElementById("menuClose");
  const overlay = document.getElementById("menuOverlay");
  const sideMenu = document.getElementById("sideMenu");
  if (!toggle || !sideMenu) return;

  function abrirMenu() {
    document.body.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
    sideMenu.setAttribute("aria-hidden", "false");
  }

  function cerrarMenu() {
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    sideMenu.setAttribute("aria-hidden", "true");
  }

  toggle.addEventListener("click", () => {
    document.body.classList.contains("menu-open") ? cerrarMenu() : abrirMenu();
  });

  if (cerrarBtn) cerrarBtn.addEventListener("click", cerrarMenu);
  if (overlay) overlay.addEventListener("click", cerrarMenu);

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") cerrarMenu();
  });
});
