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
