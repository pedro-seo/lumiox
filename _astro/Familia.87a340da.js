(()=>{
  const r=document.getElementById('lxFam');if(!r)return;
  const pasos=['luz','persianas','clima','musica'];
  const termo=r.querySelector('#termo');
  const $$=s=>[...r.querySelectorAll(s)];
  let k=0,t=0,visible=true;
  const red=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function marcar(p){
    $$('.tab-tile').forEach(e=>e.classList.toggle('on',e.dataset.t===p||r.classList.contains('m-'+e.dataset.t)));
    $$('.senal').forEach(e=>e.classList.toggle('act',e.dataset.t===p));
    $$('.lx-fam-chip').forEach(e=>e.classList.toggle('on',r.classList.contains('m-'+e.dataset.t)));
  }
  function paso(){
    if(!visible){t=setTimeout(paso,500);return}
    if(k===pasos.length){ // reinicio suave
      pasos.forEach(p=>r.classList.remove('m-'+p));termo.setAttribute('opacity','0');marcar(null);k=0;t=setTimeout(paso,1600);return}
    const p=pasos[k++];
    r.classList.remove('toca','salta');void r.offsetWidth;
    r.classList.add('toca');marcar(p);
    setTimeout(()=>{r.classList.add('m-'+p,'salta');marcar(p);if(p==='clima')termo.setAttribute('opacity','1')},650);
    setTimeout(()=>r.classList.remove('toca'),1500);
    setTimeout(()=>r.classList.remove('salta'),2600);
    t=setTimeout(paso,p==='musica'?5200:3400);
  }
  if(red){pasos.forEach(p=>r.classList.add('m-'+p));termo.setAttribute('opacity','1');marcar(null);return}
  new IntersectionObserver(([e])=>{visible=e.isIntersecting},{threshold:.2}).observe(r);
  t=setTimeout(paso,900);
})();