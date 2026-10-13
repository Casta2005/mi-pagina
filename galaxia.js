/* =========================================================
   CONFIG — edita SOLO esta parte para personalizar la galaxia.
   Cada elemento de "orbes" es un objeto flotante en el espacio.

   tipo:  "pensamiento" (esfera rosa)
          "detalle"     (cristal dorado)
          "cancion"     (anillo violeta)
          "corazon"     (corazón rojo)
   titulo, texto: lo que se muestra al hacer clic.
   artista: opcional (para canciones).
   enlace:  opcional, p. ej. "Soundtrack.html" -> muestra un link.
   Puedes agregar o quitar orbes: se acomodan solos alrededor.
========================================================= */
const CONFIG = {
  nombre: "Jennifer",

  orbes: [
    {
      tipo: "pensamiento",
      titulo: "Constancia",
      texto: "Me impresiona que no te rindes. Lo que empiezas lo terminas, y eso se nota en todo lo que haces.",
    },
    {
      tipo: "detalle",
      titulo: "Tu sonrisa",
      texto: "Hay un instante justo antes de que sonrías en el que ya se te nota en los ojos. Ese detalle es mi favorito.",
    },
    {
      tipo: "cancion",
      titulo: "Until I Found You",
      artista: "Stephen Sanchez",
      texto: "Esta canción suena sola en mi cabeza cuando pienso en ti.",
      enlace: "Soundtrack.html",
    },
    {
      tipo: "pensamiento",
      titulo: "La mejor Inge",
      texto: "La mejor Inge del mundo mundial. Y no es exageración, es un hecho comprobado.",
    },
    {
      tipo: "detalle",
      titulo: "Zeus",
      texto: "La forma en que hablas de Zeus. Se nota lo mucho que lo quieres, y eso dice muchísimo de ti.",
    },
    {
      tipo: "corazon",
      titulo: "Un deseo",
      texto: "Ojalá entrenar contigo toda la vida.",
    },
    {
      tipo: "cancion",
      titulo: "Día Tras Día",
      artista: "Andrés Cepeda",
      texto: "Cada día contigo cerca se siente como un buen día.",
      enlace: "Soundtrack.html",
    },
    {
      tipo: "detalle",
      titulo: "Flores amarillas",
      texto: "Desde el 21 de septiembre el amarillo es tu color. Cada vez que lo veo, pienso en ti.",
    },
    {
      tipo: "pensamiento",
      titulo: "Fuerte",
      texto: "Fuerte en la barra, y más fuerte todavía en todo lo demás.",
    },
    {
      tipo: "pensamiento",
      titulo: "Siempre",
      texto: "Puedes contar conmigo en las buenas y en las malas. No es una frase bonita, es una promesa.",
    },
  ],

  // Se muestra cuando ya encontró TODOS los orbes. Usa {nombre}.
  mensajeFinal:
    "Encontraste todos los orbes, {nombre}. Esta galaxia es pequeña, " +
    "pero todo lo que hay en ella es verdad. Gracias por existir.",
};

/* =========================================================
   A partir de aquí es lógica — no hace falta tocarlo.
========================================================= */
(function () {
  const errorEl = document.getElementById("error");
  function mostrarError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.hidden = false;
  }

  if (typeof THREE === "undefined") {
    mostrarError("No se pudo cargar Three.js. Revisa tu conexión a internet y recarga la página.");
    return;
  }

  const canvas = document.getElementById("escena");
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  } catch (e) {
    mostrarError("Tu navegador no soporta WebGL, así que no se puede mostrar la galaxia 3D.");
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  /* ---------- escena y cámara ---------- */
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x07050d);

  const FOV_BASE = 72;
  const FOV_FOCO = 46;
  const camera = new THREE.PerspectiveCamera(FOV_BASE, window.innerWidth / window.innerHeight, 0.1, 700);

  const COLORES = {
    pensamiento: 0xff2f92,
    detalle: 0xffd56b,
    cancion: 0x8f7bff,
    corazon: 0xff4d6d,
  };
  const ETIQUETAS = {
    pensamiento: "Un pensamiento",
    detalle: "Un detalle",
    cancion: "Una canción",
    corazon: "Un deseo",
  };

  /* ---------- textura de brillo suave (se reutiliza en todo) ---------- */
  function crearTexturaBrillo() {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.2, "rgba(255,255,255,0.55)");
    gr.addColorStop(0.5, "rgba(255,255,255,0.12)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }
  const texBrillo = crearTexturaBrillo();

  /* ---------- estrellas de fondo ---------- */
  function crearEstrellas(n) {
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const c = new THREE.Color();
    for (let i = 0; i < n; i++) {
      const r = 200 + Math.random() * 300;
      const u = Math.random() * 2 - 1;
      const t = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      pos[i * 3] = r * s * Math.cos(t);
      pos[i * 3 + 1] = r * u;
      pos[i * 3 + 2] = r * s * Math.sin(t);
      c.setHSL(0.55 + Math.random() * 0.3, 0.5, 0.65 + Math.random() * 0.3);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({
      size: 3,
      map: texBrillo,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Points(geo, mat);
  }
  const estrellas = crearEstrellas(2500);
  scene.add(estrellas);

  /* ---------- galaxia espiral (la cámara queda dentro del disco) ---------- */
  function crearGalaxia() {
    const N = 9000;
    const BRAZOS = 4;
    const RADIO = 140;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const cDentro = new THREE.Color(0xffd56b);
    const cMedio = new THREE.Color(0xff2f92);
    const cFuera = new THREE.Color(0x6a4cff);
    const c = new THREE.Color();

    for (let i = 0; i < N; i++) {
      const rn = Math.pow(Math.random(), 0.75);
      const r = rn * RADIO + 4;
      const brazo = i % BRAZOS;
      const ang = (brazo / BRAZOS) * Math.PI * 2 + r * 0.05 + (Math.random() - 0.5) * 0.7;
      const dispersion = 1 + rn * 5;
      pos[i * 3] = Math.cos(ang) * r + (Math.random() - 0.5) * dispersion;
      pos[i * 3 + 1] = (Math.random() - 0.5) * (7 * (1 - rn) + 1.5);
      pos[i * 3 + 2] = Math.sin(ang) * r + (Math.random() - 0.5) * dispersion;

      if (rn < 0.4) c.copy(cDentro).lerp(cMedio, rn / 0.4);
      else c.copy(cMedio).lerp(cFuera, (rn - 0.4) / 0.6);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({
      size: 1.7,
      map: texBrillo,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const pts = new THREE.Points(geo, mat);
    const grupo = new THREE.Group();
    grupo.add(pts);
    grupo.position.set(-70, -6, -10);
    grupo.rotation.z = 0.28;
    return grupo;
  }
  const galaxia = crearGalaxia();
  scene.add(galaxia);

  /* ---------- nebulosas (manchas de color suaves) ---------- */
  [
    [0xff2f92, 160, 20, -140, 130],
    [0x6a4cff, -150, 40, -120, 150],
    [0xffd56b, 20, -60, 190, 110],
    [0xff4d6d, -120, -30, 140, 120],
    [0x8f7bff, 130, 70, 100, 100],
  ].forEach(([color, x, y, z, escala]) => {
    const mat = new THREE.SpriteMaterial({
      map: texBrillo,
      color,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const s = new THREE.Sprite(mat);
    s.position.set(x, y, z);
    s.scale.set(escala, escala, 1);
    scene.add(s);
  });

  /* ---------- orbes ---------- */
  function geometriaCorazon() {
    const s = new THREE.Shape();
    s.moveTo(0, 0.35);
    s.bezierCurveTo(0, 0.8, -0.9, 0.9, -0.9, 0.2);
    s.bezierCurveTo(-0.9, -0.4, -0.2, -0.7, 0, -1.05);
    s.bezierCurveTo(0.2, -0.7, 0.9, -0.4, 0.9, 0.2);
    s.bezierCurveTo(0.9, 0.9, 0, 0.8, 0, 0.35);
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.35,
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.1,
      bevelSegments: 3,
      curveSegments: 24,
    });
    g.center();
    return g;
  }

  function geometriaPara(tipo) {
    switch (tipo) {
      case "detalle": return new THREE.IcosahedronGeometry(0.85, 1);
      case "cancion": return new THREE.TorusGeometry(0.62, 0.23, 16, 48);
      case "corazon": return geometriaCorazon();
      default: return new THREE.SphereGeometry(0.7, 32, 32);
    }
  }

  const orbes = [];
  const hitboxes = [];
  const total = CONFIG.orbes.length;
  const blanco = new THREE.Color(0xffffff);

  CONFIG.orbes.forEach((datos, i) => {
    const hex = COLORES[datos.tipo] || COLORES.pensamiento;
    const color = new THREE.Color(hex);

    const ang = -0.35 + (i / total) * Math.PI * 2;
    const radio = 15 + (i % 3) * 2.5;
    const y = Math.sin(i * 2.3) * 6.5;

    const grupo = new THREE.Group();
    grupo.position.set(Math.sin(ang) * radio, y, -Math.cos(ang) * radio);

    const nucleo = new THREE.Mesh(
      geometriaPara(datos.tipo),
      new THREE.MeshBasicMaterial({ color: color.clone().lerp(blanco, 0.3) })
    );
    grupo.add(nucleo);

    const brillo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texBrillo,
        color,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    brillo.scale.set(7, 7, 1);
    grupo.add(brillo);

    // esfera invisible más grande: facilita tocar el orbe en el celular
    const hit = new THREE.Mesh(
      new THREE.SphereGeometry(1.9, 12, 12),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
    );
    hit.userData.index = i;
    grupo.add(hit);
    hitboxes.push(hit);

    scene.add(grupo);
    orbes.push({
      datos,
      hex,
      grupo,
      nucleo,
      brillo,
      baseY: y,
      fase: Math.random() * Math.PI * 2,
      escala: 1,
      visto: false,
    });
  });

  /* ---------- estado de la cámara ---------- */
  const EJE_Y = new THREE.Vector3(0, 1, 0);
  const EJE_X = new THREE.Vector3(1, 0, 0);
  const euler = new THREE.Euler(0, 0, 0, "YXZ");
  const camQ = new THREE.Quaternion();
  const objetivoQ = new THREE.Quaternion();
  const qAux = new THREE.Quaternion();
  const mAux = new THREE.Matrix4();
  const cero = new THREE.Vector3();
  const posObjetivo = new THREE.Vector3();

  let yaw = 0, pitch = 0, tYaw = 0, tPitch = 0;
  let enfocado = null;      // índice del orbe enfocado o null
  let entrado = false;
  let hovered = -1;

  /* ---------- giroscopio ---------- */
  let giroActivo = false;
  let deviceQ = null;
  let sincronizar = false;
  const offsetQ = new THREE.Quaternion();
  const Q_PANTALLA = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
  const EJE_Z = new THREE.Vector3(0, 0, 1);
  let temporizadorGiro = null;

  function anguloPantalla() {
    if (screen.orientation && typeof screen.orientation.angle === "number") return screen.orientation.angle;
    return window.orientation || 0;
  }

  function alAOrientar(e) {
    if (e.alpha === null || e.beta === null || e.gamma === null) return;
    if (temporizadorGiro) { clearTimeout(temporizadorGiro); temporizadorGiro = null; }
    const rad = THREE.MathUtils.degToRad;
    if (!deviceQ) deviceQ = new THREE.Quaternion();
    euler.set(rad(e.beta), rad(e.alpha), -rad(e.gamma), "YXZ");
    deviceQ.setFromEuler(euler);
    deviceQ.multiply(Q_PANTALLA);
    deviceQ.multiply(qAux.setFromAxisAngle(EJE_Z, -rad(anguloPantalla())));
    if (sincronizar) {
      // que la vista actual no salte al activar el giroscopio
      offsetQ.copy(camQ).multiply(qAux.copy(deviceQ).invert());
      sincronizar = false;
    }
  }

  const gyroBtn = document.getElementById("gyroBtn");

  function pintarBotonGiro() {
    if (!gyroBtn) return;
    gyroBtn.textContent = giroActivo ? "Giroscopio: sí" : "Giroscopio: no";
    gyroBtn.classList.toggle("is-on", giroActivo);
  }

  function sincronizarDesdeCamara() {
    euler.setFromQuaternion(camQ, "YXZ");
    yaw = tYaw = euler.y;
    pitch = tPitch = THREE.MathUtils.clamp(euler.x, -1.45, 1.45);
  }

  async function activarGiro() {
    try {
      if (typeof DeviceOrientationEvent !== "undefined" &&
          typeof DeviceOrientationEvent.requestPermission === "function") {
        const r = await DeviceOrientationEvent.requestPermission();
        if (r !== "granted") return false;
      }
    } catch (err) {
      return false;
    }
    window.addEventListener("deviceorientation", alAOrientar, true);
    giroActivo = true;
    deviceQ = null;
    sincronizar = true;
    pintarBotonGiro();
    // si en 2 s no llega ningún dato real, este equipo no tiene giroscopio
    temporizadorGiro = setTimeout(() => { if (!deviceQ) desactivarGiro(); }, 2000);
    return true;
  }

  function desactivarGiro() {
    window.removeEventListener("deviceorientation", alAOrientar, true);
    if (temporizadorGiro) { clearTimeout(temporizadorGiro); temporizadorGiro = null; }
    if (giroActivo && enfocado === null) sincronizarDesdeCamara();
    giroActivo = false;
    deviceQ = null;
    pintarBotonGiro();
  }

  const esTactil = ("ontouchstart" in window) || (navigator.maxTouchPoints > 0);
  const hayGiro = "DeviceOrientationEvent" in window;

  if (gyroBtn && esTactil && hayGiro) {
    gyroBtn.hidden = false;
    gyroBtn.addEventListener("click", () => {
      if (giroActivo) desactivarGiro();
      else activarGiro();
    });
  }

  /* ---------- panel ---------- */
  const panel = document.getElementById("panel");
  const panelTag = document.getElementById("panelTag");
  const panelTitle = document.getElementById("panelTitle");
  const panelArtist = document.getElementById("panelArtist");
  const panelText = document.getElementById("panelText");
  const panelLink = document.getElementById("panelLink");
  const panelClose = document.getElementById("panelClose");
  const contadorEl = document.getElementById("contador");
  const hintEl = document.getElementById("hint");
  let temporizadorPanel = null;
  let panelAbierto = false;
  let finalMostrado = false;

  function conNombre(t) {
    return t.replaceAll("{nombre}", CONFIG.nombre);
  }

  function actualizarContador() {
    const vistos = orbes.filter((o) => o.visto).length;
    if (contadorEl) contadorEl.textContent = `${vistos} / ${total} orbes`;
  }

  function mostrarPanel(info) {
    if (temporizadorPanel) { clearTimeout(temporizadorPanel); temporizadorPanel = null; }
    panel.style.setProperty("--acc", info.color);
    panelTag.textContent = info.tag;
    panelTitle.textContent = info.titulo;
    panelText.textContent = info.texto;

    panelArtist.hidden = !info.artista;
    panelArtist.textContent = info.artista || "";

    panelLink.hidden = !info.enlace;
    if (info.enlace) {
      panelLink.href = info.enlace;
      panelLink.textContent = info.tipo === "cancion" ? "♪ Escuchar en el Soundtrack" : "Ver más";
    }

    panel.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.add("is-open")));
    panelAbierto = true;
  }

  function ocultarPanel() {
    panel.classList.remove("is-open");
    panelAbierto = false;
    temporizadorPanel = setTimeout(() => { panel.hidden = true; }, 400);
  }

  function hexACss(hex) {
    return "#" + hex.toString(16).padStart(6, "0");
  }

  /* ---------- enfocar / cerrar ---------- */
  function enfocar(i) {
    const o = orbes[i];
    if (!o) return;
    enfocado = i;

    // la cámara se acerca por la misma línea que va hacia el orbe
    posObjetivo.copy(o.grupo.position).multiplyScalar(0.5);

    // mira al orbe y lo sube un poco para que no lo tape la tarjeta
    mAux.lookAt(cero, o.grupo.position, EJE_Y);
    objetivoQ.setFromRotationMatrix(mAux);
    const vertical = window.innerHeight > window.innerWidth;
    objetivoQ.multiply(qAux.setFromAxisAngle(EJE_X, vertical ? -0.2 : -0.1));

    o.visto = true;
    actualizarContador();

    mostrarPanel({
      tag: ETIQUETAS[o.datos.tipo] || "Un pensamiento",
      titulo: o.datos.titulo,
      artista: o.datos.artista,
      texto: conNombre(o.datos.texto),
      enlace: o.datos.enlace,
      tipo: o.datos.tipo,
      color: hexACss(o.hex),
    });
  }

  function cerrarPanel() {
    if (!panelAbierto) return;

    if (enfocado !== null) {
      // la cámara se queda mirando hacia donde estaba, sin saltos
      if (giroActivo && deviceQ) {
        offsetQ.copy(camQ).multiply(qAux.copy(deviceQ).invert());
      } else {
        sincronizarDesdeCamara();
      }
      enfocado = null;
    }
    ocultarPanel();

    const todos = orbes.every((o) => o.visto);
    if (todos && !finalMostrado) {
      finalMostrado = true;
      setTimeout(mostrarFinal, 900);
    }
  }

  function mostrarFinal() {
    mostrarPanel({
      tag: "Los encontraste todos",
      titulo: `Para ti, ${CONFIG.nombre}`,
      texto: conNombre(CONFIG.mensajeFinal),
      color: "#ffd56b",
    });
  }

  panelClose.addEventListener("click", cerrarPanel);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarPanel();
  });

  /* ---------- intro ---------- */
  const intro = document.getElementById("intro");
  const entrarBtn = document.getElementById("entrarBtn");
  const entrarGiroBtn = document.getElementById("entrarGiroBtn");
  const introText = document.getElementById("introText");

  if (esTactil) {
    if (hintEl) hintEl.textContent = "Desliza el dedo o mueve tu celular · toca un orbe";
    if (hayGiro && entrarGiroBtn) entrarGiroBtn.hidden = false;
  } else {
    if (hintEl) hintEl.textContent = "Arrastra para mirar alrededor · haz clic en un orbe";
  }
  if (introText && introText.textContent.trim() === "") {
    introText.textContent = "Mira a tu alrededor y toca los orbes que brillan.";
  }

  function entrar() {
    entrado = true;
    intro.classList.add("is-gone");
    actualizarContador();
    setTimeout(() => { if (hintEl) hintEl.classList.add("is-hidden"); }, 9000);
  }

  entrarBtn.addEventListener("click", entrar);
  if (entrarGiroBtn) {
    entrarGiroBtn.addEventListener("click", async () => {
      await activarGiro();   // en iPhone el permiso debe pedirse dentro de un clic
      entrar();
    });
  }

  /* ---------- puntero: arrastrar para mirar, tocar para elegir ---------- */
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  function orbeEn(clientX, clientY) {
    ndc.x = (clientX / window.innerWidth) * 2 - 1;
    ndc.y = -(clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(hitboxes, false);
    return hits.length ? hits[0].object.userData.index : -1;
  }

  let arrastrando = false;
  let movido = 0;
  let ultimoX = 0, ultimoY = 0;

  canvas.addEventListener("pointerdown", (e) => {
    if (!entrado) return;
    arrastrando = true;
    movido = 0;
    ultimoX = e.clientX;
    ultimoY = e.clientY;
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignorar */ }
    canvas.classList.add("is-grabbing");
  });

  canvas.addEventListener("pointermove", (e) => {
    if (arrastrando) {
      const dx = e.clientX - ultimoX;
      const dy = e.clientY - ultimoY;
      ultimoX = e.clientX;
      ultimoY = e.clientY;
      movido += Math.abs(dx) + Math.abs(dy);

      if (enfocado === null) {
        const k = (THREE.MathUtils.degToRad(camera.fov)) / window.innerHeight;
        if (giroActivo && deviceQ) {
          // con giroscopio, arrastrar solo gira horizontalmente
          offsetQ.premultiply(qAux.setFromAxisAngle(EJE_Y, dx * k));
        } else {
          tYaw += dx * k;
          tPitch = THREE.MathUtils.clamp(tPitch + dy * k, -1.45, 1.45);
        }
      }
    } else if (e.pointerType === "mouse" && entrado) {
      hovered = orbeEn(e.clientX, e.clientY);
      canvas.style.cursor = hovered >= 0 ? "pointer" : "";
    }
  });

  function soltar(e, cancelado) {
    if (!arrastrando) return;
    arrastrando = false;
    canvas.classList.remove("is-grabbing");
    if (cancelado || movido > 8) return;

    // fue un toque/clic, no un arrastre
    const i = orbeEn(e.clientX, e.clientY);
    if (i >= 0) enfocar(i);
    else if (panelAbierto) cerrarPanel();
  }
  canvas.addEventListener("pointerup", (e) => soltar(e, false));
  canvas.addEventListener("pointercancel", (e) => soltar(e, true));

  /* ---------- tamaño de ventana ---------- */
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  /* ---------- bucle de animación ---------- */
  const reloj = new THREE.Clock();
  const destinoQ = new THREE.Quaternion();
  const origen = new THREE.Vector3();

  function animar() {
    requestAnimationFrame(animar);
    const dt = Math.min(reloj.getDelta(), 0.05);
    const t = reloj.elapsedTime;

    let fovObjetivo = FOV_BASE;
    let posDestino = origen;

    if (enfocado !== null) {
      camQ.slerp(objetivoQ, 1 - Math.exp(-dt * 3.5));
      posDestino = posObjetivo;
      fovObjetivo = FOV_FOCO;
    } else if (giroActivo && deviceQ) {
      destinoQ.copy(offsetQ).multiply(deviceQ);
      camQ.slerp(destinoQ, 0.3);
    } else {
      if (!entrado) tYaw += dt * 0.05;   // giro lento de fondo en la pantalla de entrada
      yaw += (tYaw - yaw) * 0.12;
      pitch += (tPitch - pitch) * 0.12;
      euler.set(pitch, yaw, 0, "YXZ");
      camQ.setFromEuler(euler);
    }

    camera.quaternion.copy(camQ);
    camera.position.lerp(posDestino, 1 - Math.exp(-dt * 3));
    if (Math.abs(camera.fov - fovObjetivo) > 0.01) {
      camera.fov += (fovObjetivo - camera.fov) * (1 - Math.exp(-dt * 3));
      camera.updateProjectionMatrix();
    }

    // orbes: flotan, giran y palpitan
    for (let i = 0; i < orbes.length; i++) {
      const o = orbes[i];
      o.grupo.position.y = o.baseY + Math.sin(t * 0.7 + o.fase) * 0.45;
      o.nucleo.rotation.y += dt * 0.6;
      o.nucleo.rotation.x += dt * 0.25;

      const pulso = 1 + 0.08 * Math.sin(t * 2 + o.fase);
      o.brillo.scale.set(7 * pulso, 7 * pulso, 1);
      o.brillo.material.opacity = o.visto ? 0.6 : 0.95;

      const escalaObjetivo = enfocado === i ? 1.3 : hovered === i ? 1.15 : 1;
      o.escala += (escalaObjetivo - o.escala) * 0.15;
      o.grupo.scale.setScalar(o.escala);
    }

    galaxia.rotation.y += dt * 0.01;
    estrellas.rotation.y += dt * 0.003;

    renderer.render(scene, camera);
  }

  actualizarContador();
  pintarBotonGiro();
  animar();
})();
