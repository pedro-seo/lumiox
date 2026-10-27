// Burbuja de WhatsApp: "Lumiox te está escribiendo…" → mensaje con doble check y globo de notificación.
// Si la página tiene el iPad del hero, aparece unos segundos después de desbloquearlo.
(() => {
  const btn = document.querySelector('.lx-wa');
  if (!btn) return;
  const KEY = 'lx-wa-teaser';
  try { if (sessionStorage.getItem(KEY)) return; } catch (_) {}
  const lang = document.documentElement.lang || 'es';
  const T = {
    es: ['¡Hola! 👋 ¿Hablamos de tu proyecto de domótica?', 'Lumiox', 'en línea', 'Cerrar'],
    ca: ['Hola! 👋 Parlem del teu projecte de domòtica?', 'Lumiox', 'en línia', 'Tancar'],
    en: ['Hi! 👋 Want to talk about your smart home project?', 'Lumiox', 'online', 'Close'],
  }[lang] || [];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const css = document.createElement('style');
  css.textContent = `
.lx-wa-badge{position:absolute;top:-3px;right:-3px;min-width:20px;height:20px;padding:0 5px;border-radius:10px;background:#ff3b30;color:#fff;font:700 11px/20px Inter,sans-serif;text-align:center;box-shadow:0 0 0 2px #0A0E1A;transform:scale(0);transition:transform .35s cubic-bezier(.34,1.56,.64,1)}
.lx-wa.lx-wa-noti .lx-wa-badge{transform:scale(1)}
.lx-wa.lx-wa-noti svg{animation:lxWaRing .9s ease-in-out 2}
@keyframes lxWaRing{0%,100%{transform:rotate(0)}15%{transform:rotate(-16deg)}30%{transform:rotate(14deg)}45%{transform:rotate(-10deg)}60%{transform:rotate(6deg)}75%{transform:rotate(-2deg)}}
.lx-wa-burbuja{position:fixed;right:20px;bottom:92px;z-index:9700;width:min(280px,calc(100vw - 32px));background:#fff;color:#111b21;border-radius:16px 16px 4px 16px;box-shadow:0 14px 40px rgba(0,0,0,.45);font-family:Inter,sans-serif;cursor:pointer;text-decoration:none;transform-origin:100% 100%;transform:translateY(12px) scale(.6);opacity:0;transition:transform .45s cubic-bezier(.34,1.56,.64,1),opacity .3s ease}
.lx-wa-burbuja.lx-on{transform:none;opacity:1}
.lx-wa-burbuja.lx-off{transform:translateY(8px) scale(.85);opacity:0;transition-duration:.25s}
.lx-wa-burbuja::after{content:"";position:absolute;right:-1px;bottom:-7px;border:8px solid transparent;border-top-color:#fff;border-right:0;transform:skewX(-25deg)}
.lx-wa-cab{display:flex;align-items:center;gap:9px;padding:10px 12px 8px;border-bottom:1px solid #eef0f2}
.lx-wa-av{width:30px;height:30px;border-radius:50%;background:#0A0E1A;display:flex;align-items:center;justify-content:center;flex:none}
.lx-wa-av svg{width:18px;height:18px}
.lx-wa-nom{font-size:13px;font-weight:700;line-height:1.1}
.lx-wa-est{font-size:11px;color:#25a35a;line-height:1.3}
.lx-wa-x{margin-left:auto;width:24px;height:24px;border:0;border-radius:50%;background:#f0f2f5;color:#54656f;font:600 15px/24px sans-serif;cursor:pointer;padding:0}
.lx-wa-cuerpo{padding:10px 12px 12px;min-height:44px}
.lx-wa-dots{display:inline-flex;gap:4px;padding:9px 12px;background:#f0f2f5;border-radius:12px}
.lx-wa-dots i{width:7px;height:7px;border-radius:50%;background:#8696a0;animation:lxWaDot 1s ease-in-out infinite}
.lx-wa-dots i:nth-child(2){animation-delay:.15s}.lx-wa-dots i:nth-child(3){animation-delay:.3s}
@keyframes lxWaDot{0%,60%,100%{transform:none;opacity:.5}30%{transform:translateY(-4px);opacity:1}}
.lx-wa-msg{display:block;font-size:14px;line-height:1.45;animation:lxWaMsg .35s ease-out}
@keyframes lxWaMsg{from{opacity:0;transform:translateY(4px)}}
.lx-wa-meta{display:flex;justify-content:flex-end;align-items:center;gap:4px;margin-top:3px;font-size:11px;color:#667781}
.lx-wa-meta svg{width:16px;height:11px}
.lx-wa-meta path{stroke:#8696a0;transition:stroke .4s}
.lx-wa-leido .lx-wa-meta path{stroke:#34b7f1}
@media (max-width:640px){.lx-wa-burbuja{right:16px;bottom:82px}}
@media (prefers-reduced-motion:reduce){.lx-wa.lx-wa-noti svg,.lx-wa-dots i,.lx-wa-msg{animation:none}.lx-wa-burbuja{transition:opacity .2s}}`;
  document.head.appendChild(css);

  const badge = document.createElement('span');
  badge.className = 'lx-wa-badge';
  badge.textContent = '1';
  badge.setAttribute('aria-hidden', 'true');
  btn.appendChild(badge);

  const b = document.createElement('div');
  b.className = 'lx-wa-burbuja';
  b.setAttribute('role', 'status');
  b.innerHTML = `
    <div class="lx-wa-cab">
      <span class="lx-wa-av" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="#00D4FF" stroke-width="2.4" stroke-linecap="round"><path d="M16.2 7.3a6 6 0 1 1-8.4 0"/><path d="M12 4v7"/></svg></span>
      <span><span class="lx-wa-nom">${T[1]}</span><br><span class="lx-wa-est">${T[2]}</span></span>
      <button class="lx-wa-x" type="button" aria-label="${T[3]}">×</button>
    </div>
    <div class="lx-wa-cuerpo"><span class="lx-wa-dots" aria-hidden="true"><i></i><i></i><i></i></span></div>`;
  document.body.appendChild(b);

  let autoCierre;
  const cerrar = (recordar) => {
    clearTimeout(autoCierre);
    b.classList.add('lx-off');
    b.classList.remove('lx-on');
    setTimeout(() => b.remove(), 400);
    if (recordar) { btn.classList.remove('lx-wa-noti'); try { sessionStorage.setItem(KEY, '1'); } catch (_) {} }
  };
  b.querySelector('.lx-wa-x').addEventListener('click', (e) => { e.stopPropagation(); cerrar(true); });
  b.addEventListener('click', () => { window.open(btn.href, '_blank', 'noopener'); cerrar(true); });
  btn.addEventListener('click', () => cerrar(true));

  let lanzado = false;
  function lanzar() {
    if (lanzado || !b.isConnected) return;
    lanzado = true;
    b.classList.add('lx-on');
    const hora = new Date().toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit', hour12: false });
    setTimeout(() => {
      b.querySelector('.lx-wa-cuerpo').innerHTML =
        `<span class="lx-wa-msg">${T[0]}</span><span class="lx-wa-meta">${hora}<svg viewBox="0 0 18 11" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6l3.5 3.5L11 2"/><path d="M7 9.5L14 2"/></svg></span>`;
      btn.classList.add('lx-wa-noti');
      setTimeout(() => b.classList.add('lx-wa-leido'), 1200);
      try { sessionStorage.setItem(KEY, '1'); } catch (_) {}
      autoCierre = setTimeout(() => cerrar(false), 14000);
    }, reduce ? 0 : 1700);
  }

  // Con iPad en el hero: unos segundos después del desbloqueo. Si no, tras un rato en la página.
  const conIpad = document.querySelector('.lx-panel') && !reduce;
  if (conIpad) {
    document.addEventListener('lx:desbloqueado', () => setTimeout(lanzar, 4500), { once: true });
    setTimeout(lanzar, 20000);
  } else {
    setTimeout(lanzar, 7000);
  }
})();
