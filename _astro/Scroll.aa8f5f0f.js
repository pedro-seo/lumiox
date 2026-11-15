/* Animaciones ligadas al scroll (estilo Apple): se calculan en cada frame según la posición,
   así que avanzan al bajar y retroceden al subir.
   - [data-sx-words]: el texto se ilumina palabra a palabra.
   - [data-sx-rise]: los hijos suben y aparecen, escalonados por columna. */
(()=>{
  // TEMPORAL: «Reducir movimiento» desactivado en toda la web (buscar "and (max-width:0px)" para restaurarlo)
  const RED=matchMedia('(prefers-reduced-motion: reduce) and (max-width:0px)').matches;
  if(RED)return;
  const cl=v=>v<0?0:v>1?1:v;
  const ease=t=>1-Math.pow(1-t,3);
  const items=[];

  document.querySelectorAll('[data-sx-words]').forEach(el=>{
    const words=[];
    const walk=n=>[...n.childNodes].forEach(c=>{
      if(c.nodeType===3){
        const f=document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(t=>{
          if(!t)return;
          if(/^\s+$/.test(t)){f.append(t);return}
          const s=document.createElement('span');s.className='sx-w';s.textContent=t;words.push(s);f.append(s);
        });
        c.replaceWith(f);
      }else if(c.nodeType===1&&c.tagName!=='BR')walk(c);
    });
    walk(el);el.classList.add('sx-words');
    let last=-1;
    items.push(vh=>{
      const r=el.getBoundingClientRect();
      const n=Math.round(cl((vh*.86-r.top)/(vh*.42))*words.length);
      if(n!==last){last=n;words.forEach((w,i)=>w.classList.toggle('on',i<n))}
    });
  });

  // Títulos de sección y rejillas de tarjetas que aún no tienen efecto: aparición suave al subir
  document.querySelectorAll('section .lx-sh, section .lx-grid2, section .lx-grid3, section .lx-grid4').forEach(el=>{
    if(!el.hasAttribute('data-sx-rise')&&!el.hasAttribute('data-sx-steps')&&!el.closest('[data-sx-rise]'))el.setAttribute('data-sx-rise','');
  });

  // Fotos con zoom y profundidad (parallax) dentro de su marco
  document.querySelectorAll('[data-sx-zoom] img').forEach(img=>{
    img.classList.add('sx-zoom');
    items.push(vh=>{
      const r=img.parentElement.getBoundingClientRect();
      if(r.top>vh||r.bottom<0)return;
      const c=cl((vh-r.top)/(vh+r.height));          // 0 al entrar por abajo, 1 al salir por arriba
      img.style.scale=(1.22-.16*ease(cl(c*1.6))).toFixed(4);
      img.style.translate=`0 ${((c-.5)*-28).toFixed(1)}px`;
    });
  });

  // Proceso: una línea se dibuja con el scroll y cada paso se enciende al llegar
  document.querySelectorAll('[data-sx-steps]').forEach(el=>{
    const kids=[...el.children];
    const dots=kids.map(k=>k.firstElementChild);
    const line=document.createElement('div');line.className='sx-line';line.innerHTML='<i></i>';
    el.prepend(line);el.classList.add('sx-steps');
    const fill=line.firstChild;
    items.push(vh=>{
      const r=el.getBoundingClientRect();
      if(r.top>vh*1.2||r.bottom<-vh*.2)return;
      const p=cl((vh*.82-r.top)/(Math.max(r.height,vh*.35)*1.05));
      const unaFila=kids.every(k=>k.offsetTop===kids[0].offsetTop);
      if(unaFila){
        const a=dots[0],b=dots[dots.length-1],ka=kids[0],kb=kids[kids.length-1];
        const x0=ka.offsetLeft+a.offsetLeft+a.offsetWidth/2,x1=kb.offsetLeft+b.offsetLeft+b.offsetWidth/2;
        line.style.cssText=`display:block;left:${x0}px;width:${x1-x0}px;top:${ka.offsetTop+a.offsetTop+a.offsetHeight/2-1}px`;
        fill.style.transform=`scaleX(${p.toFixed(4)})`;
      }else line.style.display='none';
      kids.forEach((k,i)=>{
        const umbral=unaFila?i/(kids.length-1)*.98:null;
        const on=unaFila?p>=umbral:(vh*.75>k.getBoundingClientRect().top);
        k.classList.toggle('sx-on',on);
      });
    });
  });

  // Antes y después: el deslizador se mueve solo con el scroll hasta que lo tocas
  document.querySelectorAll('.lx-ba').forEach(ba=>{
    const rng=ba.querySelector('.lx-ba-range'),top=ba.querySelector('.lx-ba-top'),ln=ba.querySelector('.lx-ba-line');
    if(!rng||!top||!ln)return;
    let manual=false;
    ['pointerdown','touchstart','keydown'].forEach(ev=>rng.addEventListener(ev,()=>{manual=true},{passive:true}));
    items.push(vh=>{
      if(manual)return;
      const r=ba.getBoundingClientRect();
      if(r.top>vh||r.bottom<0)return;
      const c=ease(cl((vh*.95-r.top)/(vh*.6)));
      const v=Math.round(6+c*84);
      rng.value=v;top.style.clipPath=`inset(0 ${100-v}% 0 0)`;ln.style.left=v+'%';
    });
  });

  // Cifras del hero: cuentan hacia arriba al aparecer
  document.querySelectorAll('.lx-stat-row .lx-grad-text').forEach(el=>{
    const m=el.textContent.trim().match(/^(\D*)(\d+)(.*)$/);
    if(!m||/\d/.test(m[3]))return;
    const [,pre,num,suf]=m,fin=+num;
    el.style.fontVariantNumeric='tabular-nums';
    el.textContent=pre+'0'+suf;
    const io=new IntersectionObserver(([e])=>{
      if(!e.isIntersecting)return;io.disconnect();
      const t0=performance.now()+250,dur=1600;
      const f=t=>{const k=cl((t-t0)/dur);el.textContent=pre+Math.round(fin*ease(k))+suf;if(k<1)requestAnimationFrame(f)};
      requestAnimationFrame(f);
    });
    io.observe(el);
  });

  document.querySelectorAll('[data-sx-rise]').forEach(el=>{
    const kids=[...el.children];
    kids.forEach(k=>k.classList.add('sx-rise'));
    items.push(vh=>{
      const r=el.getBoundingClientRect();
      if(r.top>vh*1.3||r.bottom<-vh*.3)return;
      const w=el.offsetWidth||1;
      kids.forEach(k=>{
        const top=r.top+k.offsetTop;
        const p=ease(cl((vh*.98-top)/(vh*.36)-(k.offsetLeft/w)*.45));
        if(p>=1){if(k._sx!==1){k._sx=1;k.style.opacity='';k.style.translate='';k.style.scale=''}return}
        k._sx=p;
        k.style.opacity=p.toFixed(3);
        k.style.translate=`0 ${((1-p)*80).toFixed(1)}px`;
        k.style.scale=(.94+.06*p).toFixed(4);
      });
    });
  });

  let pend=false;
  const run=()=>{pend=false;const vh=innerHeight;items.forEach(f=>f(vh))};
  addEventListener('scroll',()=>{if(!pend){pend=true;requestAnimationFrame(run)}},{passive:true});
  addEventListener('resize',run);
  run();
})();
