// Panel de control del hero: efectos a pantalla completa (luz, clima, persianas, música, seguridad).
// Compartido por la home y las páginas de ciudad en ES/CA/EN. Textos sacados del propio HTML (data-on/data-off).
(() => {
  const root = document.documentElement;
  const panel = document.querySelector('.lx-panel');
  if (!panel) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const lang = root.lang || 'es';
  const $ = (id) => document.getElementById(id);

  // Solo el panel queda por encima de los efectos: el contenedor del hero no debe crear
  // un stacking context alto (si no, el texto del hero escapa de la oscuridad/persianas)
  const heroC = panel.closest('.lx-c');
  if (heroC && heroC.contains(panel)) {
    heroC.style.zIndex = 'auto';
    heroC.querySelectorAll('.lx-hero-flex > *').forEach((col) => {
      if (!col.contains(panel)) { col.style.position = 'relative'; col.style.zIndex = '1'; }
    });
  }

  // Las capas viven en <body> para cubrir toda la página
  document.querySelectorAll('.lx-fx').forEach((el) => document.body.appendChild(el));
  const fxLuz = $('fxLuz');
  fxLuz.style.background = 'rgba(2,4,10,0.92)';
  const capa = (id) => {
    const el = document.createElement('div');
    el.className = 'lx-fx';
    el.id = id;
    // copia el atributo de scope de Astro para heredar el estilo base de .lx-fx
    [...fxLuz.attributes].forEach((a) => { if (a.name.startsWith('data-astro-cid')) el.setAttribute(a.name, ''); });
    document.body.appendChild(el);
    return el;
  };
  const fxBrillo = capa('fxBrillo');
  const fxMusica = capa('fxMusica');
  document.querySelectorAll('.lx-fx').forEach((el) => el.setAttribute('aria-hidden', 'true'));

  const tiles = [...panel.querySelectorAll('.lx-tile')];
  const tile = (k) => panel.querySelector(`[data-fx="${k}"]`);
  const slider = $('lxLuzSlider');
  const pct = $('lxLuzPct');
  const tempEl = $('lxTempCalor');

  // ---------- estado ----------
  const state = { luz: true, calor: false, frio: false, persianas: false, musica: false, seguridad: false };
  let nivel = slider.valueAsNumber || 80;
  let preview = null;

  const luzEstado = tile('luz').querySelector('.lx-tile-estado');
  const luzOn = luzEstado.dataset.on || '';
  const luzOff = luzEstado.dataset.off || '';
  const textoLuz = (on, n) => (on ? luzOn.replace(/\d+\s?%/, `${n}%`) : luzOff);

  function efectivo() {
    const e = { ...state };
    if (preview) {
      e[preview] = true;
      if (preview === 'calor') e.frio = false;
      if (preview === 'frio') e.calor = false;
    }
    return e;
  }

  function oscuridad(e) {
    if (!e.luz) return 0.92;
    return Math.max(0, Math.min(1, (80 - nivel) / 70)) * 0.8;
  }

  let ultimaOsc = null;
  function render(flick = false) {
    const e = efectivo();
    ['calor', 'frio', 'persianas', 'musica', 'seguridad'].forEach((k) => root.classList.toggle(`fx-${k}`, e[k]));

    const osc = oscuridad(e);
    root.classList.toggle('fx-luz', osc > 0);
    root.classList.toggle('lx-linterna', canHover && !e.luz);
    root.classList.toggle('lx-oscuro', !e.luz);
    root.style.setProperty('--lx-pared', e.luz ? (0.2 + (0.8 * nivel) / 100).toFixed(3) : '0');
    fxLuz.style.opacity = osc.toFixed(3);
    fxBrillo.style.opacity = e.luz ? Math.max(0, (nivel - 80) / 20).toFixed(3) : '0';
    if (flick && ultimaOsc !== null && !reduce && Math.abs(osc - ultimaOsc) > 0.5) parpadeo(fxLuz, ultimaOsc, osc);
    ultimaOsc = osc;

    temperatura(e.calor ? 23.5 : e.frio ? 18 : 19.5);
    if (e.musica) visualizador.start();
    if (e.seguridad) rec.start();
    else rec.stop();
  }

  // Encendido/apagado con parpadeo tipo fluorescente
  function parpadeo(el, desde, hasta) {
    const f = hasta > desde
      ? [desde, hasta * 0.85, desde, hasta, hasta * 0.6, hasta]
      : [desde, desde + 0.5, desde, desde + 0.35, hasta * 0.7, hasta];
    el.animate(f.map((o) => ({ opacity: Math.min(1, o) })), { duration: 650, easing: 'steps(1, end)' });
  }

  function pintarTile(t, on) {
    t.setAttribute('aria-pressed', String(on));
    const est = t.querySelector('.lx-tile-estado');
    if (t.dataset.fx === 'luz') est.textContent = textoLuz(on, nivel);
    else if (est.dataset.on) est.textContent = on ? est.dataset.on : est.dataset.off;
  }

  function pop(t) {
    if (reduce) return;
    t.classList.remove('lx-pop');
    void t.offsetWidth;
    t.classList.add('lx-pop');
  }

  function ripple(t, ev) {
    if (reduce) return;
    const r = t.getBoundingClientRect();
    const s = document.createElement('span');
    const d = Math.max(r.width, r.height) * 2;
    s.className = 'lx-ripple';
    s.style.width = s.style.height = `${d}px`;
    const x = ev.clientX ? ev.clientX - r.left : r.width / 2;
    const y = ev.clientY ? ev.clientY - r.top : r.height / 2;
    s.style.left = `${x - d / 2}px`;
    s.style.top = `${y - d / 2}px`;
    s.style.setProperty('--rc', getComputedStyle(t.querySelector('.lx-tile-icon')).getPropertyValue('--tc'));
    t.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  }

  tiles.forEach((t) => {
    const k = t.dataset.fx;
    if (canHover) {
      t.addEventListener('mouseenter', () => { if (!state[k]) { preview = k; render(); } });
      t.addEventListener('mouseleave', () => { if (preview === k) { preview = null; render(); } });
    }
    t.addEventListener('click', (ev) => {
      state[k] = !state[k];
      if (preview === k) preview = null;
      if (k === 'calor' && state.calor) { state.frio = false; pintarTile(tile('frio'), false); }
      if (k === 'frio' && state.frio) { state.calor = false; pintarTile(tile('calor'), false); }
      if (k === 'luz' && state.luz && nivel < 30) setNivel(80);
      if (state[k]) pop(t);
      ripple(t, ev);
      pintarTile(t, state[k]);
      if (k === 'musica') state.musica ? audio.start() : audio.stop();
      render(k === 'luz');
    });
  });

  // ---------- slider de intensidad ----------
  function setNivel(n) {
    nivel = n;
    slider.value = String(n);
    slider.style.setProperty('--p', `${((n - +slider.min) / (+slider.max - +slider.min)) * 100}%`);
    pct.textContent = `${n}%`;
  }
  let finArrastre;
  slider.addEventListener('input', () => {
    setNivel(slider.valueAsNumber);
    if (!state.luz) state.luz = true;
    pintarTile(tile('luz'), true);
    root.classList.add('lx-arrastrando');
    clearTimeout(finArrastre);
    finArrastre = setTimeout(() => root.classList.remove('lx-arrastrando'), 250);
    render();
  });
  setNivel(nivel);

  // Linterna: con la luz apagada, el cursor ilumina la página
  if (canHover) {
    let raf = 0, mx = 0, my = 0;
    addEventListener('pointermove', (ev) => {
      mx = ev.clientX; my = ev.clientY;
      if (raf || !root.classList.contains('lx-linterna')) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        fxLuz.style.setProperty('--mx', `${mx}px`);
        fxLuz.style.setProperty('--my', `${my}px`);
      });
    }, { passive: true });
  }

  // ---------- temperatura ----------
  let temp = 19.5, tempRaf = 0, tempObjetivo = 19.5;
  function temperatura(obj) {
    if (obj === tempObjetivo && tempRaf) return;
    tempObjetivo = obj;
    cancelAnimationFrame(tempRaf);
    let prev = performance.now();
    const paso = (now) => {
      const dt = now - prev; prev = now;
      const d = tempObjetivo - temp;
      temp = Math.abs(d) < 0.05 ? tempObjetivo : temp + Math.sign(d) * Math.min(Math.abs(d), dt / 600);
      tempEl.textContent = temp.toFixed(1).replace('.', lang === 'en' ? '.' : ',');
      tempRaf = temp === tempObjetivo ? 0 : requestAnimationFrame(paso);
    };
    tempRaf = requestAnimationFrame(paso);
  }

  // ---------- partículas ----------
  const rnd = (a, b) => a + Math.random() * (b - a);
  if (!reduce) {
    const brasas = document.querySelector('#fxCalor .lx-brasas');
    brasas.classList.add('lx-brasas-js');
    for (let i = 0; i < 34; i++) {
      const b = document.createElement('i');
      b.className = 'lx-brasa';
      const s = rnd(2, 6.5);
      b.style.cssText = `left:${rnd(0, 100)}%;width:${s}px;height:${s}px;--dx:${rnd(-60, 60)}px;--h:${rnd(45, 95)}vh;animation-duration:${rnd(3.5, 8)}s;animation-delay:-${rnd(0, 8)}s;--c:${['#ffb347', '#ff8c32', '#ffd27f', '#ff6a1f'][i % 4]}`;
      brasas.appendChild(b);
    }

    const nieve = $('lxNieve');
    nieve.textContent = '';
    // tres planos de profundidad: lejos (pequeño, borroso, lento) → cerca
    [[16, 6, 10, 2.2, 0.35, 14, 20], [14, 10, 16, 0.6, 0.65, 8, 13], [8, 16, 26, 0, 0.9, 5, 8]].forEach(([n, s0, s1, blur, op, d0, d1]) => {
      for (let i = 0; i < n; i++) {
        const c = document.createElement('span');
        c.className = 'lx-copo lx-copo2';
        c.textContent = '❄';
        c.style.cssText = `left:${rnd(-2, 100)}%;font-size:${rnd(s0, s1)}px;opacity:${op};filter:blur(${blur}px);--dx:${rnd(-50, 50)}px;--r:${rnd(-360, 360)}deg;animation-duration:${rnd(d0, d1)}s;animation-delay:-${rnd(0, d1)}s`;
        nieve.appendChild(c);
      }
    });
  } else {
    $('lxNieve').textContent = '';
  }

  // ---------- grabación de cámaras (seguridad) ----------
  const rec = (() => {
    const el = document.createElement('div');
    el.className = 'lx-rec';
    el.innerHTML = '<i></i>REC <span></span>';
    $('fxSeguridad').appendChild(el);
    const hora = el.querySelector('span');
    let t = 0;
    const tick = () => { hora.textContent = new Date().toLocaleTimeString(lang, { hour12: false }); };
    return {
      start() { if (!t) { tick(); t = setInterval(tick, 1000); } },
      stop() { clearInterval(t); t = 0; },
    };
  })();

  // ---------- audio (pad ambiental) ----------
  const audio = (() => {
    const acordes = [
      [261.63, 329.63, 392.0, 493.88],
      [220.0, 261.63, 329.63, 392.0],
      [174.61, 220.0, 261.63, 329.63],
      [196.0, 246.94, 293.66, 349.23],
    ];
    const DUR = 3.4;
    let ctx, master, analyser, sonando = false, i = 0, timer, voces = new Set();

    function init() {
      if (ctx) return;
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0;
      const filtro = ctx.createBiquadFilter();
      filtro.type = 'lowpass';
      filtro.frequency.value = 1100;
      analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.82;
      master.connect(filtro).connect(analyser).connect(ctx.destination);
    }

    function acorde(freqs) {
      const now = ctx.currentTime;
      freqs.forEach((f, n) => {
        const osc = ctx.createOscillator();
        osc.type = n === 0 ? 'triangle' : 'sine';
        osc.frequency.value = f;
        osc.detune.value = rnd(-6, 6);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.05, now + 0.7);
        g.gain.linearRampToValueAtTime(0, now + DUR);
        osc.connect(g).connect(master);
        osc.start(now);
        osc.stop(now + DUR + 0.1);
        voces.add(osc);
        osc.onended = () => voces.delete(osc);
      });
    }

    function bucle() {
      acorde(acordes[i++ % acordes.length]);
      timer = setTimeout(bucle, DUR * 1000 * 0.92);
    }

    return {
      get analyser() { return sonando ? analyser : null; },
      start() {
        init();
        if (ctx.state === 'suspended') ctx.resume();
        const now = ctx.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.setValueAtTime(master.gain.value, now);
        master.gain.linearRampToValueAtTime(1, now + 0.5);
        if (!sonando) { sonando = true; bucle(); }
      },
      stop() {
        if (!ctx || !sonando) return;
        sonando = false;
        clearTimeout(timer);
        const now = ctx.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.setValueAtTime(master.gain.value, now);
        master.gain.linearRampToValueAtTime(0, now + 0.5);
        voces.forEach((o) => { try { o.stop(now + 0.55); } catch (_) {} });
      },
      pausa(p) {
        if (!ctx) return;
        if (p) ctx.suspend();
        else if (sonando) ctx.resume();
      },
    };
  })();

  document.addEventListener('visibilitychange', () => { audio.pausa(document.hidden); if (!document.hidden) render(); });

  // ---------- visualizador de música ----------
  const visualizador = (() => {
    if (reduce) return { start() {} };
    const cv = document.createElement('canvas');
    fxMusica.appendChild(cv);
    const g = cv.getContext('2d');
    let raf = 0, datos, w = 0, h = 0;
    const N = 48;
    const alturas = new Float32Array(N);
    function medir() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth; h = Math.min(220, innerHeight * 0.3);
      cv.width = w * dpr; cv.height = h * dpr;
      cv.style.height = `${h}px`;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    addEventListener('resize', () => { if (raf) medir(); });
    function frame(t) {
      const activo = root.classList.contains('fx-musica') && !root.classList.contains('lx-fx-pausa') && !document.hidden;
      if (!activo) { raf = 0; return; }
      const an = audio.analyser;
      if (an) { datos = datos || new Uint8Array(an.frequencyBinCount); an.getByteFrequencyData(datos); }
      g.clearRect(0, 0, w, h);
      const bw = w / N;
      const grad = g.createLinearGradient(0, h, 0, 0);
      grad.addColorStop(0, 'rgba(0,245,160,0.55)');
      grad.addColorStop(0.6, 'rgba(0,212,255,0.28)');
      grad.addColorStop(1, 'rgba(123,97,255,0)');
      g.fillStyle = grad;
      for (let i = 0; i < N; i++) {
        // espejo desde el centro para que quede simétrico
        const k = Math.abs(i - (N - 1) / 2) / (N / 2);
        let v;
        if (an) v = datos[Math.min(datos.length - 1, Math.floor(k * datos.length * 0.55))] / 255;
        else v = 0.25 + 0.2 * Math.sin(t / 380 + i * 0.5) * Math.sin(t / 900 + k * 4);
        alturas[i] += (Math.max(0.04, v) - alturas[i]) * 0.25;
        const bh = alturas[i] * h * (1 - k * 0.35);
        g.beginPath();
        g.roundRect ? g.roundRect(i * bw + 2, h - bh, bw - 4, bh, [4, 4, 0, 0]) : g.rect(i * bw + 2, h - bh, bw - 4, bh);
        g.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    return { start() { if (!raf) { medir(); raf = requestAnimationFrame(frame); } } };
  })();

  // ---------- pausa fuera de pantalla ----------
  new IntersectionObserver(([en]) => {
    root.classList.toggle('lx-fx-pausa', !en.isIntersecting);
    if (en.isIntersecting) render();
  }, { rootMargin: '120px' }).observe(panel);

  // ---------- reloj ----------
  const reloj = $('lxPanelHora');
  const pintaHora = () => { reloj.textContent = new Date().toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit', hour12: false }); };
  pintaHora();
  setTimeout(() => { pintaHora(); setInterval(pintaHora, 60000); }, (60 - new Date().getSeconds()) * 1000);

  // ---------- pantalla de bloqueo: desbloqueo con reconocimiento facial ----------
  (() => {
    const pantalla = panel.querySelector(':scope > div');
    if (!pantalla || reduce) return;
    const T = {
      es: ['Verificando identidad…', 'Identidad verificada', 'Toca para desbloquear'],
      ca: ['Verificant identitat…', 'Identitat verificada', 'Toca per desbloquejar'],
      en: ['Verifying identity…', 'Identity verified', 'Tap to unlock'],
    }[lang] || ['Verificando identidad…', 'Identidad verificada', 'Toca para desbloquear'];
    const ahora = new Date();
    const lock = document.createElement('div');
    lock.className = 'lx-lock';
    lock.setAttribute('aria-hidden', 'true');
    lock.innerHTML = `
      <div class="lx-lock-candado"><svg viewBox="0 0 24 24"><path class="lx-lock-arco" d="M7.5 11V7.5a4.5 4.5 0 0 1 9 0V11"/><rect x="5" y="11" width="14" height="10" rx="2.5"/></svg></div>
      <div class="lx-lock-hora">${ahora.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
      <div class="lx-lock-fecha">${ahora.toLocaleDateString(lang, { weekday: 'long', day: 'numeric', month: 'long' })}</div>
      <div class="lx-lock-face">
        <svg viewBox="0 0 64 64">
          <path class="lx-face-marco" d="M4 18V10a6 6 0 0 1 6-6h8M46 4h8a6 6 0 0 1 6 6v8M60 46v8a6 6 0 0 1-6 6h-8M18 60h-8a6 6 0 0 1-6-6v-8"/>
          <g class="lx-face-cara"><path d="M23 24v5M41 24v5M32 26v10h-3M24 44c4.5 4 11.5 4 16 0"/></g>
          <path class="lx-face-check" d="M20 33l8 8 16-17"/>
        </svg>
        <span class="lx-face-scan"></span>
      </div>
      <div class="lx-lock-texto">${T[2]}</div>
      <div class="lx-lock-barra"></div>`;
    pantalla.appendChild(lock);
    panel.classList.add('lx-bloqueado');
    const txt = lock.querySelector('.lx-lock-texto');
    [...pantalla.children].filter((c) => c !== lock && !c.classList.contains('grid')).forEach((c, j) => c.style.setProperty('--i', j ? 7 + j : 0));
    pantalla.querySelectorAll('.lx-tile').forEach((t, i) => t.style.setProperty('--i', i + 1));

    let fase = 0, timers = [];
    const en = (ms, fn) => timers.push(setTimeout(fn, ms));
    function desbloquear(rapido) {
      if (fase) return;
      fase = 1;
      const k = rapido ? 0.45 : 1;
      lock.classList.add('lx-lock-despierta');
      en(350 * k, () => { lock.classList.add('lx-lock-escaneando'); txt.textContent = T[0]; });
      en(1900 * k, () => { lock.classList.add('lx-lock-ok'); txt.textContent = T[1]; });
      en(2650 * k, () => {
        lock.classList.add('lx-lock-fuera');
        panel.classList.remove('lx-bloqueado');
        panel.classList.add('lx-entrando');
        document.dispatchEvent(new Event('lx:desbloqueado'));
      });
      en(3600 * k, () => { lock.remove(); });
      en(4300 * k, () => panel.classList.remove('lx-entrando'));
    }
    lock.addEventListener('click', () => {
      if (!fase) return desbloquear(true);
      // ya en marcha: salta directamente al final
      timers.forEach(clearTimeout);
      lock.classList.add('lx-lock-ok', 'lx-lock-fuera');
      panel.classList.remove('lx-bloqueado');
      panel.classList.add('lx-entrando');
      document.dispatchEvent(new Event('lx:desbloqueado'));
      setTimeout(() => lock.remove(), 900);
      setTimeout(() => panel.classList.remove('lx-entrando'), 1500);
    });
    const io = new IntersectionObserver(([e]) => {
      if (e.intersectionRatio >= 0.45) { io.disconnect(); setTimeout(() => desbloquear(false), 450); }
    }, { threshold: [0, 0.45, 1] });
    io.observe(panel);
  })();

  render();
  panel.classList.add('lx-listo');
})();
