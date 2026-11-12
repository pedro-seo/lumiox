(()=>{const e=document.documentElement,t=document.querySelector(".lx-panel");if(!t)return;const n=matchMedia("(prefers-reduced-motion: reduce)").matches,a=matchMedia("(hover: hover) and (pointer: fine)").matches,i=e.lang||"es",o=e=>document.getElementById(e),s=t.closest(".lx-c");s&&s.contains(t)&&(s.style.zIndex="auto",s.querySelectorAll(".lx-hero-flex > *").forEach(e=>{e.contains(t)||(e.style.position="relative",e.style.zIndex="1")})),document.querySelectorAll(".lx-fx").forEach(e=>document.body.appendChild(e));const l=o("fxLuz");l.style.background="rgba(2,4,10,0.92)";const r=e=>{const t=document.createElement("div");return t.className="lx-fx",t.id=e,[...l.attributes].forEach(e=>{e.name.startsWith("data-astro-cid")&&t.setAttribute(e.name,"")}),document.body.appendChild(t),t},c=r("fxBrillo"),d=r("fxMusica");document.querySelectorAll(".lx-fx").forEach(e=>e.setAttribute("aria-hidden","true"));const u=[...t.querySelectorAll(".lx-tile")],m=e=>t.querySelector(`[data-fx="${e}"]`),x=o("lxLuzSlider"),f=o("lxLuzPct"),p=o("lxTempCalor"),h={luz:!0,calor:!1,frio:!1,persianas:!1,musica:!1,seguridad:!1};let g=x.valueAsNumber||80,v=null;const y=m("luz").querySelector(".lx-tile-estado"),L=y.dataset.on||"",M=y.dataset.off||"";let b,A=null;function T(t=!1){const o=function(){const e={...h};return v&&(e[v]=!0,"calor"===v&&(e.frio=!1),"frio"===v&&(e.calor=!1)),e}();["calor","frio","persianas","musica","seguridad"].forEach(t=>e.classList.toggle(`fx-${t}`,o[t]));const s=function(e){return e.luz?.8*Math.max(0,Math.min(1,(80-g)/70)):.92}(o);e.classList.toggle("fx-luz",s>0),e.classList.toggle("lx-linterna",a&&!o.luz),e.classList.toggle("lx-oscuro",!o.luz),e.style.setProperty("--lx-pared",o.luz?(.2+.8*g/100).toFixed(3):"0"),l.style.opacity=s.toFixed(3),c.style.opacity=o.luz?Math.max(0,(g-80)/20).toFixed(3):"0",t&&null!==A&&!n&&Math.abs(s-A)>.5&&function(e,t,n){const a=n>t?[t,.85*n,t,n,.6*n,n]:[t,t+.5,t,t+.35,.7*n,n];e.animate(a.map(e=>({opacity:Math.min(1,e)})),{duration:650,easing:"steps(1, end)"})}(l,A,s),A=s,function(e){if(e===w&&S)return;w=e,cancelAnimationFrame(S);let t=performance.now();const n=e=>{const a=e-t;t=e;const o=w-E;E=Math.abs(o)<.05?w:E+Math.sign(o)*Math.min(Math.abs(o),a/600),p.textContent=E.toFixed(1).replace(".","en"===i?".":","),S=E===w?0:requestAnimationFrame(n)};S=requestAnimationFrame(n)}(o.calor?23.5:o.frio?18:19.5),o.musica&&F.start(),o.seguridad?z.start():z.stop()}function q(e,t){e.setAttribute("aria-pressed",String(t));const n=e.querySelector(".lx-tile-estado");"luz"===e.dataset.fx?n.textContent=((e,t)=>e?L.replace(/\d+\s?%/,`${t}%`):M)(t,g):n.dataset.on&&(n.textContent=t?n.dataset.on:n.dataset.off)}function C(e){g=e,x.value=String(e),x.style.setProperty("--p",(e-+x.min)/(+x.max-+x.min)*100+"%"),f.textContent=`${e}%`}if(u.forEach(e=>{const t=e.dataset.fx;a&&(e.addEventListener("mouseenter",()=>{h[t]||(v=t,T())}),e.addEventListener("mouseleave",()=>{v===t&&(v=null,T())})),e.addEventListener("click",a=>{h[t]=!h[t],v===t&&(v=null),"calor"===t&&h.calor&&(h.frio=!1,q(m("frio"),!1)),"frio"===t&&h.frio&&(h.calor=!1,q(m("calor"),!1)),"luz"===t&&h.luz&&g<30&&C(80),h[t]&&function(e){n||(e.classList.remove("lx-pop"),e.offsetWidth,e.classList.add("lx-pop"))}(e),function(e,t){if(n)return;const a=e.getBoundingClientRect(),i=document.createElement("span"),o=2*Math.max(a.width,a.height);i.className="lx-ripple",i.style.width=i.style.height=`${o}px`;const s=t.clientX?t.clientX-a.left:a.width/2,l=t.clientY?t.clientY-a.top:a.height/2;i.style.left=s-o/2+"px",i.style.top=l-o/2+"px",i.style.setProperty("--rc",getComputedStyle(e.querySelector(".lx-tile-icon")).getPropertyValue("--tc")),e.appendChild(i),i.addEventListener("animationend",()=>i.remove())}(e,a),q(e,h[t]),"musica"===t&&(h.musica?k.start():k.stop()),T("luz"===t)})}),x.addEventListener("input",()=>{C(x.valueAsNumber),h.luz||(h.luz=!0),q(m("luz"),!0),e.classList.add("lx-arrastrando"),clearTimeout(b),b=setTimeout(()=>e.classList.remove("lx-arrastrando"),250),T()}),C(g),a){let t=0,n=0,a=0;addEventListener("pointermove",i=>{n=i.clientX,a=i.clientY,!t&&e.classList.contains("lx-linterna")&&(t=requestAnimationFrame(()=>{t=0,l.style.setProperty("--mx",`${n}px`),l.style.setProperty("--my",`${a}px`)}))},{passive:!0})}let E=19.5,S=0,w=19.5;const $=(e,t)=>e+Math.random()*(t-e);if(n)o("lxNieve").textContent="";else{const e=document.querySelector("#fxCalor .lx-brasas");e.classList.add("lx-brasas-js");for(let t=0;t<34;t++){const n=document.createElement("i");n.className="lx-brasa";const a=$(2,6.5);n.style.cssText=`left:${$(0,100)}%;width:${a}px;height:${a}px;--dx:${$(-60,60)}px;--h:${$(45,95)}vh;animation-duration:${$(3.5,8)}s;animation-delay:-${$(0,8)}s;--c:${["#ffb347","#ff8c32","#ffd27f","#ff6a1f"][t%4]}`,e.appendChild(n)}const t=o("lxNieve");t.textContent="",[[16,6,10,2.2,.35,14,20],[14,10,16,.6,.65,8,13],[8,16,26,0,.9,5,8]].forEach(([e,n,a,i,o,s,l])=>{for(let r=0;r<e;r++){const e=document.createElement("span");e.className="lx-copo lx-copo2",e.textContent="❄",e.style.cssText=`left:${$(-2,100)}%;font-size:${$(n,a)}px;opacity:${o};filter:blur(${i}px);--dx:${$(-50,50)}px;--r:${$(-360,360)}deg;animation-duration:${$(s,l)}s;animation-delay:-${$(0,l)}s`,t.appendChild(e)}})}const z=(()=>{const e=document.createElement("div");e.className="lx-rec",e.innerHTML="<i></i>REC <span></span>",o("fxSeguridad").appendChild(e);const t=e.querySelector("span");let n=0;const a=()=>{t.textContent=(new Date).toLocaleTimeString(i,{hour12:!1})};return{start(){n||(a(),n=setInterval(a,1e3))},stop(){clearInterval(n),n=0}}})(),k=(()=>{const e=[[261.63,329.63,392,493.88],[220,261.63,329.63,392],[174.61,220,261.63,329.63],[196,246.94,293.66,349.23]];let t,n,a,i,o=!1,s=0,l=new Set;function r(){!function(e){const a=t.currentTime;e.forEach((e,i)=>{const o=t.createOscillator();o.type=0===i?"triangle":"sine",o.frequency.value=e,o.detune.value=$(-6,6);const s=t.createGain();s.gain.setValueAtTime(0,a),s.gain.linearRampToValueAtTime(.05,a+.7),s.gain.linearRampToValueAtTime(0,a+3.4),o.connect(s).connect(n),o.start(a),o.stop(a+3.4+.1),l.add(o),o.onended=()=>l.delete(o)})}(e[s++%e.length]),i=setTimeout(r,3128)}return{get analyser(){return o?a:null},start(){!function(){if(t)return;t=new(window.AudioContext||window.webkitAudioContext),n=t.createGain(),n.gain.value=0;const e=t.createBiquadFilter();e.type="lowpass",e.frequency.value=1100,a=t.createAnalyser(),a.fftSize=128,a.smoothingTimeConstant=.82,n.connect(e).connect(a).connect(t.destination)}(),"suspended"===t.state&&t.resume();const e=t.currentTime;n.gain.cancelScheduledValues(e),n.gain.setValueAtTime(n.gain.value,e),n.gain.linearRampToValueAtTime(1,e+.5),o||(o=!0,r())},stop(){if(!t||!o)return;o=!1,clearTimeout(i);const e=t.currentTime;n.gain.cancelScheduledValues(e),n.gain.setValueAtTime(n.gain.value,e),n.gain.linearRampToValueAtTime(0,e+.5),l.forEach(t=>{try{t.stop(e+.55)}catch(e){}})},pausa(e){t&&(e?t.suspend():o&&t.resume())}}})();document.addEventListener("visibilitychange",()=>{k.pausa(document.hidden),document.hidden||T()});const F=(()=>{if(n)return{start(){}};const t=document.createElement("canvas");d.appendChild(t);const a=t.getContext("2d");let i,o=0,s=0,l=0;const r=new Float32Array(48);function c(){const e=Math.min(devicePixelRatio||1,2);s=innerWidth,l=Math.min(220,.3*innerHeight),t.width=s*e,t.height=l*e,t.style.height=`${l}px`,a.setTransform(e,0,0,e,0,0)}function u(t){if(!(e.classList.contains("fx-musica")&&!e.classList.contains("lx-fx-pausa")&&!document.hidden))return void(o=0);const n=k.analyser;n&&(i=i||new Uint8Array(n.frequencyBinCount),n.getByteFrequencyData(i)),a.clearRect(0,0,s,l);const c=s/48,d=a.createLinearGradient(0,l,0,0);d.addColorStop(0,"rgba(0,245,160,0.55)"),d.addColorStop(.6,"rgba(0,212,255,0.28)"),d.addColorStop(1,"rgba(123,97,255,0)"),a.fillStyle=d;for(let e=0;e<48;e++){const o=Math.abs(e-23.5)/24;let s;s=n?i[Math.min(i.length-1,Math.floor(o*i.length*.55))]/255:.25+.2*Math.sin(t/380+.5*e)*Math.sin(t/900+4*o),r[e]+=.25*(Math.max(.04,s)-r[e]);const d=r[e]*l*(1-.35*o);a.beginPath(),a.roundRect?a.roundRect(e*c+2,l-d,c-4,d,[4,4,0,0]):a.rect(e*c+2,l-d,c-4,d),a.fill()}o=requestAnimationFrame(u)}return addEventListener("resize",()=>{o&&c()}),{start(){o||(c(),o=requestAnimationFrame(u))}}})();new IntersectionObserver(([t])=>{e.classList.toggle("lx-fx-pausa",!t.isIntersecting),t.isIntersecting&&T()},{rootMargin:"120px"}).observe(t);const V=o("lxPanelHora"),P=()=>{V.textContent=(new Date).toLocaleTimeString(i,{hour:"2-digit",minute:"2-digit",hour12:!1})};P(),setTimeout(()=>{P(),setInterval(P,6e4)},1e3*(60-(new Date).getSeconds())),(()=>{
/* Desbloqueo del iPad ligado al scroll (scrubbing): todo avanza y retrocede con el dedo/rueda */
const pant=t.querySelector(":scope > div");if(!pant||n)return;
const tx={es:["Verificando identidad…","Identidad verificada","Desliza para desbloquear"],ca:["Verificant identitat…","Identitat verificada","Llisca per desbloquejar"],en:["Verifying identity…","Identity verified","Scroll to unlock"]}[i]||["Verificando identidad…","Identidad verificada","Desliza para desbloquear"];
const ahora=new Date,lk=document.createElement("div");
lk.className="lx-lock";lk.setAttribute("aria-hidden","true");
lk.innerHTML=`<div class="lx-lock-top"><div class="lx-lock-candado"><svg viewBox="0 0 24 24"><path class="lx-lock-arco" d="M7.5 11V7.5a4.5 4.5 0 0 1 9 0V11"/><rect x="5" y="11" width="14" height="10" rx="2.5"/></svg></div><div class="lx-lock-hora">${ahora.toLocaleTimeString(i,{hour:"2-digit",minute:"2-digit",hour12:!1})}</div><div class="lx-lock-fecha">${ahora.toLocaleDateString(i,{weekday:"long",day:"numeric",month:"long"})}</div></div><div class="lx-lock-face"><svg viewBox="0 0 64 64"><path class="lx-face-marco" d="M4 18V10a6 6 0 0 1 6-6h8M46 4h8a6 6 0 0 1 6 6v8M60 46v8a6 6 0 0 1-6 6h-8M18 60h-8a6 6 0 0 1-6-6v-8"/><g class="lx-face-cara"><path d="M23 24v5M41 24v5M32 26v10h-3M24 44c4.5 4 11.5 4 16 0"/></g><path class="lx-face-check" d="M20 33l8 8 16-17"/></svg><span class="lx-face-scan"></span></div><div class="lx-lock-texto">${tx[2]}</div><svg class="lx-lock-flecha" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg><div class="lx-lock-barra"></div>`;
pant.appendChild(lk);t.classList.add("lx-bloqueado","lx-scrub");
const texto=lk.querySelector(".lx-lock-texto");
/* Piezas que aparecen escalonadas: cabecera, tiles, slider, pie */
const piezas=[];
[...pant.children].forEach(c=>{if(c===lk)return;if(c.classList.contains("grid"))piezas.push(...c.querySelectorAll(".lx-tile"));else piezas.push(c)});
const orden=[piezas[0],...piezas.filter(p=>p.classList.contains("lx-tile")),...piezas.slice(1).filter(p=>!p.classList.contains("lx-tile"))];
orden.forEach(p=>p.classList.add("lx-rv"));
requestAnimationFrame(()=>lk.classList.add("lx-lock-despierta"));

const cl=(x,a=0,b=1)=>x<a?a:x>b?b:x,seg=(p,a,b)=>cl((p-a)/(b-a)),eo=x=>1-Math.pow(1-x,3),eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const vh=()=>innerHeight;
/* Escritorio con el iPad visible al cargar: la portada se queda fijada mientras dura el desbloqueo */
const sec=t.closest("section"),r0=t.getBoundingClientRect();
const fijar=!!sec&&innerWidth>=1024&&scrollY<40&&r0.bottom<vh()*1.08;
let pin=null,recorrido=0;
function medir(){if(!pin)return;recorrido=Math.round(vh()*.9);const h=sec.offsetHeight;pin.style.height=h+recorrido+"px";sec.style.top=Math.min(0,vh()-h)+"px"}
if(fijar){pin=document.createElement("div");pin.className="lx-pin";sec.before(pin);pin.appendChild(sec);sec.classList.add("lx-pin-sec");medir()}
const izq=pin&&[...sec.querySelectorAll(".lx-hero-flex > *")].find(e=>!e.contains(t));
const pared=t.closest(".lx-pared-col")?.querySelector(".lx-pared");
function objetivo(){
 if(pin){const y=scrollY-pin.offsetTop;return cl(y/recorrido)}
 const r=t.getBoundingClientRect();return cl((vh()*.94-r.top)/(vh()*.78))
}
let cur=objetivo(),meta=cur,auto=0,hecho=!1,raf=0,last=0,idle=0;
/* Pinta un fotograma para el progreso p (0 = bloqueado e inclinado, 1 = desbloqueado y de frente) */
function pintar(p){
 const e=eio(seg(p,0,.72));
 t.style.transform=`perspective(1600px) translate3d(0,${(1-e)*48}px,0) rotateX(${(1-e)*24}deg) rotateY(${(1-e)*-9}deg) scale(${.86+.14*e})`;
 t.style.setProperty("--lx-tilt",(1-e).toFixed(3));
 if(pared)pared.style.opacity=(.55+.45*e).toFixed(3);
 if(izq){const k=seg(p,.55,1);izq.style.transform=`translate3d(0,${-k*26}px,0)`;izq.style.opacity=(1-k*.18).toFixed(3)}
 if(hecho)return;
 const s=seg(p,.12,.5),ok=p>=.54,u=eo(seg(p,.58,.9));
 lk.style.setProperty("--lp",s.toFixed(3));lk.style.setProperty("--lpp",(100*seg(p,.04,.54)).toFixed(1)+"%");
 lk.style.setProperty("--lu",u.toFixed(3));
 const esc=s>0&&!ok;
 lk.classList.toggle("lx-lock-escaneando",esc);lk.classList.toggle("lx-lock-ok",ok);
 const msg=ok?tx[1]:p>.04?tx[0]:tx[2];if(texto.textContent!==msg)texto.textContent=msg;
 orden.forEach((el,k)=>{const v=eo(seg(p,.6+k*.025,.78+k*.025));el.style.setProperty("--rv",v.toFixed(3))});
 if(p>=.999)desbloquear();
}
function desbloquear(){
 if(hecho)return;hecho=!0;clearTimeout(idle);
 lk.remove();t.classList.remove("lx-bloqueado","lx-scrub");
 orden.forEach(el=>{el.classList.remove("lx-rv");el.style.removeProperty("--rv")});
 t.classList.add("lx-abierto");setTimeout(()=>t.classList.remove("lx-abierto"),900);
 document.dispatchEvent(new Event("lx:desbloqueado"));
}
/* Bucle con inercia: el progreso persigue al scroll suavemente */
function tick(ts){
 const dt=last?Math.min(64,ts-last):16;last=ts;
 const m=Math.max(meta,auto);cur+=(m-cur)*(1-Math.pow(.84,dt/16.7));
 if(Math.abs(m-cur)<.0008)cur=m;
 pintar(cur);
 raf=cur===m?0:requestAnimationFrame(tick);
}
const mover=()=>{if(!raf){last=0;raf=requestAnimationFrame(tick)}};
/* Si nadie hace scroll, se desbloquea solo tras unos segundos (o al tocar la pantalla de bloqueo) */
function reproducir(){if(hecho||auto)return;const a0=Math.max(cur,meta),t0=performance.now(),f=ts=>{auto=a0+(1-a0)*eio(Math.min(1,(ts-t0)/1700));mover();if(auto<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
function esperar(){clearTimeout(idle);if(hecho)return;const r=t.getBoundingClientRect();if(r.top<vh()*.75&&r.bottom>vh()*.25)idle=setTimeout(reproducir,6e3)}
function onScroll(){meta=objetivo();if(auto&&meta>=1)auto=0;mover();esperar()}
addEventListener("scroll",onScroll,{passive:!0});
addEventListener("resize",()=>{medir();onScroll()},{passive:!0});
lk.addEventListener("click",reproducir);
pintar(cur);esperar();
})(),T(),t.classList.add("lx-listo")})();