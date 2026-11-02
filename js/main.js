(() => {
  // Breathing circle: 4s in, 2s hold, 6s out (+ short hold after exhale)
  const phases=[{n:0,d:4000,from:0,to:1},{n:1,d:2000,from:1,to:1},{n:2,d:6000,from:1,to:0}];
  const total=phases.reduce((a,p)=>a+p.d,0);
  const R0=70,R1=180;
  const ring=document.getElementById('ring'),prog=document.getElementById('progress'),count=document.getElementById('count');
  const labels=[...document.querySelectorAll('.labels span')];
  const ease=t=>0.5-0.5*Math.cos(Math.PI*t); // sine in-out: zero velocity at ends
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let start=null,last=-1;
  function frame(now){
    if(start===null)start=now;
    const t=(now-start)%total;let acc=0,p,local;
    for(p of phases){if(t<acc+p.d){local=(t-acc)/p.d;break}acc+=p.d}
    const v=p.from+(p.to-p.from)*ease(local);
    ring.setAttribute('r',(R0+(R1-R0)*v).toFixed(2));
    prog.style.strokeDasharray=`${(t/total).toFixed(4)} 1`;
    if(p.n!==last){labels.forEach((l,i)=>l.classList.toggle('on',i===p.n));last=p.n}
    count.textContent=Math.ceil(p.d/1000*(1-local))+' s';
    if(!reduce.matches)requestAnimationFrame(frame);
  }
  function startAnim(){
    if(reduce.matches){ring.setAttribute('r',(R0+R1)/2);labels[0].classList.add('on');labels[0].textContent='Indånd · Hold · Udånd';count.textContent='4 · 2 · 6 s';return}
    start=null;requestAnimationFrame(frame);
  }
  reduce.addEventListener?.('change',startAnim);startAnim();

  // Booking mock
  const days=document.getElementById('days'),slots=document.getElementById('slots'),chosen=document.getElementById('chosen');
  const fmt=new Intl.DateTimeFormat('da-DK',{weekday:'short',day:'numeric',month:'short'});
  const times=[['08:00','Individuel'],['10:00','Individuel'],['13:00','Individuel'],['17:00','Hold'],['19:00','Workshop']];
  let sel=null;const d0=new Date();
  const list=[];for(let i=1;list.length<7;i++){const d=new Date(d0);d.setDate(d0.getDate()+i);if(d.getDay()%6)list.push(d)}
  list.forEach((d,i)=>{const b=document.createElement('button');b.type='button';b.role='tab';b.textContent=fmt.format(d);
    b.onclick=()=>{[...days.children].forEach(x=>x.setAttribute('aria-selected',x===b));render(d,i)};days.append(b)});
  function render(d,i){slots.innerHTML='';times.forEach(([t,k],j)=>{if((i+j)%4===3)return;const b=document.createElement('button');b.type='button';
    b.setAttribute('aria-pressed','false');b.innerHTML=`${t}<small>${k}</small>`;
    b.onclick=()=>{slots.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));sel=`${fmt.format(d)} kl. ${t} (${k})`;chosen.textContent='Valgt: '+sel};slots.append(b)})}
  days.firstChild.click();
  document.getElementById('form').onsubmit=e=>{e.preventDefault();document.getElementById('ok').textContent=sel?`Tak! (Demo) Din forespørgsel på ${sel} er ikke sendt endnu – bookingsystem tilkobles senere.`:'Vælg venligst en tid først.'};
})();
