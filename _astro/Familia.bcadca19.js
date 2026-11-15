/* Familia (sección "La solución"): la escena se queda fija y cada tramo de scroll activa un paso.
   Al bajar se encienden luz, persianas, clima y música; al subir se deshacen. */
(()=>{
  const r=document.getElementById('lxFam');if(!r)return;
  const track=r.closest('.lx-fam-track');
  const esc=r.querySelector('.lx-fam-escena');
  const txt=r.querySelector('.lx-fam-txt');
  const termo=r.querySelector('#termo');
  const pasos=['luz','persianas','clima','musica'];
  const $$=s=>[...r.querySelectorAll(s)];
  const TXT={
    es:['Una sola pantalla. Todo tu hogar.','Un toque, y se hace la luz.','Las persianas bajan solas al anochecer.','21,5 °C. Siempre a tu gusto.','Y tu música, en cada estancia.'],
    ca:['Una sola pantalla. Tota la teva llar.','Un toc, i es fa la llum.','Les persianes baixen soles en fer-se fosc.','21,5 °C. Sempre al teu gust.','I la teva música, a cada estança.'],
    en:['One screen. Your whole home.','One tap, and there’s light.','Blinds close on their own at dusk.','21.5 °C. Always just right.','And your music, in every room.']
  };
  const T=TXT[(document.documentElement.lang||'es').slice(0,2)]||TXT.es;
  // TEMPORAL: «Reducir movimiento» desactivado en toda la web (buscar "and (max-width:0px)" para restaurarlo)
  const RED=matchMedia('(prefers-reduced-motion: reduce) and (max-width:0px)').matches;

  function marcar(p){
    $$('.tab-tile').forEach(e=>e.classList.toggle('on',e.dataset.t===p||r.classList.contains('m-'+e.dataset.t)));
    $$('.senal').forEach(e=>e.classList.toggle('act',e.dataset.t===p));
    $$('.lx-fam-chip').forEach(e=>e.classList.toggle('on',r.classList.contains('m-'+e.dataset.t)));
  }
  function aplicar(n){
    pasos.forEach((p,i)=>r.classList.toggle('m-'+p,i<n));
    termo&&termo.setAttribute('opacity',n>=3?'1':'0');
    marcar(null);
  }
  let txtT;
  function texto(i){
    if(!txt||txt.dataset.i==String(i))return;
    txt.dataset.i=i;txt.classList.remove('in');clearTimeout(txtT);
    txtT=setTimeout(()=>{txt.textContent=T[i];txt.classList.add('in')},txt.textContent?220:0);
  }

  if(RED||!track){aplicar(4);texto(0);track&&track.classList.add('lx-fam-track-off');return}

  let k=0,timers=[];
  function ir(n){
    if(n===k)return;
    timers.forEach(clearTimeout);timers=[];
    r.classList.remove('toca','salta');
    if(n>k){
      aplicar(n-1);
      const p=pasos[n-1];
      void r.offsetWidth;r.classList.add('toca');marcar(p);
      timers.push(setTimeout(()=>{r.classList.add('m-'+p,'salta');marcar(p);if(p==='clima')termo&&termo.setAttribute('opacity','1')},480));
      timers.push(setTimeout(()=>r.classList.remove('toca'),1300));
      timers.push(setTimeout(()=>r.classList.remove('salta'),2400));
    }else aplicar(n);
    k=n;texto(n);
  }

  const cl=v=>v<0?0:v>1?1:v;
  const ease=t=>1-Math.pow(1-t,3);
  let pend=false;
  function upd(){
    pend=false;
    const vh=innerHeight,rt=track.getBoundingClientRect();
    if(rt.top>vh*1.5||rt.bottom<-vh*.5)return;
    const e=ease(cl((vh-rt.top)/vh));                 // entrada: la escena crece al acercarse
    esc.style.transform=`scale(${(.86+.14*e).toFixed(4)})`;
    const p=-rt.top/Math.max(1,rt.height-vh);          // 0→1 mientras está fijada
    ir(p<.1?0:p<.3?1:p<.5?2:p<.7?3:4);
  }
  texto(0);
  addEventListener('scroll',()=>{if(!pend){pend=true;requestAnimationFrame(upd)}},{passive:true});
  addEventListener('resize',upd);
  upd();
})();
