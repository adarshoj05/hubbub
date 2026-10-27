const $=s=>document.querySelector(s);
const heart='<svg viewBox="0 0 24 24"><path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 22l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>';
const cmt='<svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z"/></svg>';
const rep='<svg viewBox="0 0 24 24"><path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4m14-1v2a3 3 0 0 1-3 3H3"/></svg>';
const posts=[
 {n:'Mira Das',h:'@mira',c:'a2',i:'MI',t:'2h',x:'Finished the lighting pass on the lantern scene. Three hours on one shadow and I regret nothing.',m:'m1',cap:'Lantern scene, final render',l:48},
 {n:'Kabir Nair',h:'@kabir',c:'a3',i:'KA',t:'5h',x:'Hot take: a good loading screen is part of the product. Ours now tells you what it is doing instead of spinning.',l:31},
 {n:'Joel Thomas',h:'@joel',c:'a4',i:'JO',t:'1d',x:'Campus hackathon recap: 14 teams, 1 broken projector, zero sleep.',m:'m2',cap:'Demo night',l:96}
];
function card(p,fresh){
 const d=document.createElement('article');d.className='post'+(fresh?' fresh':'');
 d.innerHTML=`<div class="ph"><div class="av ${p.c}">${p.i}</div><div><b>${p.n}</b><small>${p.h} · ${p.t}</small></div></div>
 <p></p>${p.m?`<div class="media ${p.m}" data-cap="${p.cap}" role="img" aria-label="${p.cap}"></div>`:''}
 <div class="acts"><button class="like" aria-pressed="false">${heart}<span>${p.l}</span></button><button>${cmt}<span>Reply</span></button><button>${rep}<span>Share</span></button></div>`;
 d.querySelector('p').textContent=p.x;
 const b=d.querySelector('.like');
 b.onclick=()=>{const on=b.classList.toggle('liked');b.setAttribute('aria-pressed',on);p.l+=on?1:-1;b.querySelector('span').textContent=p.l};
 return d;
}
posts.forEach(p=>$('#posts').append(card(p)));
const draft=$('#draft'),pub=$('#publish');
draft.oninput=()=>{const n=200-draft.value.length;$('#count').textContent=n+' left';pub.disabled=!draft.value.trim()};
pub.onclick=()=>{const p={n:'Adarsh',h:'@adarsh',c:'a5',i:'AD',t:'now',x:draft.value.trim(),l:0};$('#posts').prepend(card(p,true));draft.value='';draft.oninput()};
$('#focusPost').onclick=()=>{go('home');$('.feed-scroll').scrollTo({top:0,behavior:'smooth'});draft.focus()};

const chats={
 Mira:{c:'a2',i:'MI',m:[['t','Did you see the render?'],['m','Yes, the lantern glow is unreal'],['t','Thanks! Want to pair on the next scene?']],r:['Okay deal, Friday?','Sending you the file now.','Ha, honestly same.']},
 Kabir:{c:'a3',i:'KA',m:[['t','Standup moved to 4.']],r:['Cool, see you then.','Can you review my PR first?']},
 Joel:{c:'a4',i:'JO',m:[['t','Team name ideas?'],['m','Null Pointers']],r:['Perfect, locking it in.','Okay that is actually good.']}
};
let cur='Mira';const unread={Kabir:1};
const t=()=>new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
function renderConvos(){
 const box=$('#convos');box.innerHTML='';
 Object.keys(chats).forEach(k=>{const b=document.createElement('button');b.setAttribute('aria-pressed',k===cur);
  b.innerHTML=`<span class="av sm ${chats[k].c}">${chats[k].i}</span>${k}${unread[k]&&k!==cur?'<span class="dot" aria-label="unread"></span>':''}`;
  b.onclick=()=>{cur=k;delete unread[k];$('#msgIn').placeholder='Message '+k;renderConvos();renderMsgs()};box.append(b)})
}
function bubble(who,text){const d=document.createElement('div');d.className='msg'+(who==='m'?' mine':'');d.textContent=text;const tm=document.createElement('time');tm.textContent=t();d.append(tm);return d}
function renderMsgs(){const box=$('#msgs');box.innerHTML='';chats[cur].m.forEach(([w,x])=>box.append(bubble(w,x)));box.scrollTop=box.scrollHeight}
$('#form').onsubmit=e=>{e.preventDefault();const v=$('#msgIn').value.trim();if(!v)return;
 const who=cur,box=$('#msgs');chats[who].m.push(['m',v]);box.append(bubble('m',v));$('#msgIn').value='';
 const ty=document.createElement('div');ty.className='typing';ty.innerHTML='<i></i><i></i><i></i>';box.append(ty);box.scrollTop=box.scrollHeight;
 setTimeout(()=>{const r=chats[who].r[Math.floor(Math.random()*chats[who].r.length)];chats[who].m.push(['t',r]);
  if(who===cur){ty.remove();box.append(bubble('t',r));box.scrollTop=box.scrollHeight}else{unread[who]=1;renderConvos()}},1300)};
renderConvos();renderMsgs();

const sections=['home','explore','alerts'];
let lastSection='home';
function go(v){
 if(v!=='chat'){lastSection=v;sections.forEach(s=>$('#v-'+s).hidden=s!==v);$('.feed-scroll:not([hidden])').scrollTop=0}
 document.body.dataset.view=v;
 document.querySelectorAll('[data-go]').forEach(b=>{
  const on=b.dataset.go===v;
  if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
 if(v==='chat'&&innerWidth>760)$('#msgIn').focus();
}
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));

/* explore */
const trends=[['#lanternscene','1.2k posts'],['#hackathon','860 posts'],['Loading screens','412 posts'],['#blender','2.4k posts'],['Cardboard VR','190 posts']];
const people=[
 {n:'Sana Iqbal',h:'@sana',c:'a1',i:'SA',b:'Motion designer',f:false},
 {n:'Neha Roy',h:'@neha',c:'a5',i:'NE',b:'Frontend, loves CSS',f:false},
 {n:'Rohan Pillai',h:'@rohan',c:'a2',i:'RO',b:'Builds AR toys',f:false}];
const tiles=[['linear-gradient(135deg,#ffb81c,#ff7a59)','Sunset study'],['repeating-linear-gradient(45deg,#2438f0 0 14px,#a9c0ff 14px 28px)','Pattern drop'],['conic-gradient(from 90deg,#7fe0c3,#d6f56b,#ff9fb8,#7fe0c3)','Color wheel'],['radial-gradient(circle at 30% 30%,#fff,#2438f0 70%)','Orb test'],['linear-gradient(0deg,#0d2b33 0 40%,#ffb81c 40% 60%,#7fe0c3 60%)','Stripe study'],['repeating-radial-gradient(circle,#ff9fb8 0 10px,#fff 10px 20px)','Ripple']];
function renderExplore(){
 const q=$('#search').value.trim().toLowerCase();
 const tr=trends.filter(([a])=>a.toLowerCase().includes(q));
 const pe=people.filter(p=>(p.n+p.h+p.b).toLowerCase().includes(q));
 const T=$('#trends');T.innerHTML='';
 tr.forEach(([a,b])=>{const d=document.createElement('button');d.className='trend';d.innerHTML='<b></b><small></small>';d.children[0].textContent=a;d.children[1].textContent=b;d.onclick=()=>{$('#search').value=a;renderExplore()};T.append(d)});
 if(!tr.length)T.innerHTML='<p class="empty">No topics match. Try a shorter word.</p>';
 const P=$('#people');P.innerHTML='';
 pe.forEach(p=>{const d=document.createElement('div');d.className='person';
  d.innerHTML='<div class="av '+p.c+'">'+p.i+'</div><div><b></b><small></small></div><button class="follow"></button>';
  d.querySelector('b').textContent=p.n;d.querySelector('small').textContent=p.h+' · '+p.b;
  const f=d.querySelector('.follow');
  const paint=()=>{f.textContent=p.f?'Following':'Follow';f.setAttribute('aria-pressed',p.f)};paint();
  f.onclick=()=>{p.f=!p.f;paint()};P.append(d)});
 if(!pe.length)P.innerHTML='<p class="empty">No people match. Check the spelling or search a topic.</p>';
}
$('#search').oninput=renderExplore;
$('#grid').innerHTML=tiles.map(t=>'<div class="tile" style="background:'+t[0]+'" role="img" aria-label="'+t[1]+'"><span>'+t[1]+'</span></div>').join('');
renderExplore();

/* alerts */
const alerts=[
 {t:'like',w:'Mira Das',c:'a2',i:'MI',x:'liked your post about the lighting pass',tm:'4m',u:true},
 {t:'mention',w:'Kabir Nair',c:'a3',i:'KA',x:'mentioned you: “Adarsh, can you review the loader?”',tm:'1h',u:true},
 {t:'follow',w:'Sana Iqbal',c:'a1',i:'SA',x:'started following you',tm:'3h',u:true},
 {t:'like',w:'Joel Thomas',c:'a4',i:'JO',x:'and 12 others liked your reply',tm:'1d',u:false},
 {t:'mention',w:'Neha Roy',c:'a5',i:'NE',x:'mentioned you in a thread about dark mode',tm:'2d',u:false}];
let filt='all';
function renderAlerts(){
 const box=$('#alerts');box.innerHTML='';
 const list=alerts.filter(a=>filt==='all'||a.t===filt);
 list.forEach(a=>{const b=document.createElement('button');b.className='alert'+(a.u?' unread':'');
  b.innerHTML='<div class="av '+a.c+'">'+a.i+'</div><div><b></b> <span></span><small></small></div>'+(a.u?'<span class="dot" aria-label="unread"></span>':'');
  b.querySelector('b').textContent=a.w;b.querySelector('span').textContent=a.x;b.querySelector('small').textContent=a.tm+' ago';
  b.onclick=()=>{a.u=false;renderAlerts()};box.append(b)});
 if(!list.length)box.innerHTML='<p class="empty">Nothing here yet. New '+(filt==='all'?'alerts':filt+' alerts')+' will show up in this list.</p>';
 const n=alerts.filter(a=>a.u).length;$('#badge').textContent=n||'';
 $('#readAll').disabled=!n;
}
document.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{filt=b.dataset.f;document.querySelectorAll('.seg button').forEach(x=>x.setAttribute('aria-pressed',x===b));renderAlerts()});
$('#readAll').onclick=()=>{alerts.forEach(a=>a.u=false);renderAlerts()};
renderAlerts();
go('home');
try{const s=localStorage.getItem('hubbub-theme');if(s)document.documentElement.dataset.theme=s}catch(e){}
const isDark=()=>{const t=document.documentElement.dataset.theme;return t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches};
const toggleTheme=()=>{const t=isDark()?'light':'dark';document.documentElement.dataset.theme=t;try{localStorage.setItem('hubbub-theme',t)}catch(e){}};
$('#theme').onclick=toggleTheme;$('#themeTab').onclick=toggleTheme;