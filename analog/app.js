const all=groups.flatMap((group,groupIndex)=>group.items.map((item,index)=>({...item,groupIndex,index})));
const $=id=>document.getElementById(id);
const storeKey='analog-review-mastered-v1';
let mastered=new Set();
try { const saved=JSON.parse(localStorage.getItem(storeKey)||'[]'); if(Array.isArray(saved)) mastered=new Set(saved.filter(id=>all.some(q=>q.id===id))); } catch (_) { /* Reading remains available when storage is blocked. */ }
let current=0;

function writeProgress(){
 const n=mastered.size,total=all.length;
 $('top-progress').textContent=`已掌握 ${n} / ${total}`;
 $('progress-count').textContent=`${n} / ${total}`;
 $('progress-bar').style.width=`${n/total*100}%`;
 $('side-total').textContent=`${total} 道题`;
 const active=mastered.has(all[current].id);
 $('mastered').setAttribute('aria-pressed',String(active));
 $('mastered').textContent=active?'✓ 已掌握':'标记为已掌握';
 document.querySelectorAll('.nav-item').forEach(btn=>{
  const icon=btn.querySelector('.nav-check'); icon.textContent=mastered.has(btn.dataset.id)?'✓':'';
 });
}
function buildNav(){
 const nav=$('navigation'),select=$('question-select');
 groups.forEach(g=>{
  const section=document.createElement('div'); section.className='nav-group';
  const heading=document.createElement('div'); heading.className='nav-heading'; heading.textContent=`${g.title}  ${g.topic}`; section.append(heading);
  const items=document.createElement('div'); items.className='nav-items';
  const optgroup=document.createElement('optgroup'); optgroup.label=`${g.title} · ${g.topic}`;
  g.items.forEach(q=>{
   const index=all.findIndex(x=>x.id===q.id); const button=document.createElement('button'); button.type='button'; button.className='nav-item'; button.dataset.id=q.id;
   const code=document.createElement('span');code.className='nav-code';code.textContent=q.id.includes('-')?q.id.split('-')[1].padStart(2,'0'):q.id;
   const label=document.createElement('span');label.textContent=q.title.replace(/^(第\s*\d+\s*题|\d+\.\d+)\s*/, '');
   const check=document.createElement('span');check.className='nav-check';check.setAttribute('aria-hidden','true');button.append(code,label,check);button.addEventListener('click',()=>go(index));items.append(button);
   const option=document.createElement('option');option.value=String(index);option.textContent=q.title;optgroup.append(option);
  });
  section.append(items);nav.append(section);select.append(optgroup);
 });
 select.addEventListener('change',e=>go(Number(e.target.value)));
}
function go(index){
 if(index<0||index>=all.length)return;
 current=index;const q=all[current],g=groups[q.groupIndex];
 $('breadcrumb').innerHTML=`作业复习　/　${g.title}　/　<b>${g.topic}</b>`;
 $('question-title').textContent=q.title;
 $('question-subtitle').textContent=`${g.title} · ${g.topic}`;
 $('question-kind').textContent=q.kind;
 $('question-body').innerHTML=`<p>${q.description}</p>`;
 $('counter').textContent=`${String(current+1).padStart(2,'0')} / ${String(all.length).padStart(2,'0')}`;
 $('key-point').textContent=q.key;
 $('mobile-key-text').textContent=q.key;
 $('question-select').value=String(current);
 const fig=$('circuit-figure');fig.hidden=!q.image;
 if(q.image){ const vector=['26','27','28','210','36','37','39','bjt','mos','diff','curve1','curve2'].includes(q.image); $('circuit').src=`images/${q.image}.${vector?'svg':'png'}?v=20261116-2`; $('circuit').alt=`${q.title}的重绘${q.id==='4-1'||q.id==='4-2'?'特性曲线':'电路图'}`; $('circuit-caption').textContent=q.id==='4-1'||q.id==='4-2'?'重绘特性曲线 · 示意':'按原题重绘'; }
 const options=$('options');options.replaceChildren();
 (q.options||[]).forEach((option,i)=>{const row=document.createElement('div');row.className='option';const b=document.createElement('b');b.textContent=String.fromCharCode(65+i)+'.';row.append(b,document.createTextNode(option));options.append(row)});
 $('steps').replaceChildren();q.steps.forEach((item,i)=>{const el=document.createElement('article');el.className='step';el.innerHTML=`<span class="step-index">${String(i+1).padStart(2,'0')}</span><div class="step-content"><h3>${item.title}</h3><div class="step-copy">${item.body}</div></div>`;$('steps').append(el)});
 $('result').innerHTML=q.result;$('answer-source').textContent=q.source||'独立推导';
 const answerFig=$('answer-figure');answerFig.hidden=!q.answerImage;
 if(q.answerImage){$('answer-image').src=`images/${q.answerImage}.png`;$('answer-image').alt='稳压管输出限幅波形，标出上下限电压'}
 $('solution').hidden=true;$('show-answer').setAttribute('aria-expanded','false');$('show-answer').innerHTML='查看解答 <span aria-hidden="true">↗</span>';
 $('previous').disabled=current===0;$('next').disabled=current===all.length-1;
 $('pager-label').textContent=`${current+1} / ${all.length}`;
 document.querySelectorAll('.nav-item').forEach(btn=>{if(btn.dataset.id===q.id)btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current')});
 writeProgress();window.scrollTo({top:0,behavior:'auto'});
}
$('show-answer').addEventListener('click',()=>{
 const open=$('solution').hidden;$('solution').hidden=!open;$('show-answer').setAttribute('aria-expanded',String(open));
 $('show-answer').innerHTML=open?'收起解答 <span aria-hidden="true">↑</span>':'查看解答 <span aria-hidden="true">↗</span>';
 if(open) $('solution').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
});
$('mastered').addEventListener('click',()=>{
 const id=all[current].id;if(mastered.has(id))mastered.delete(id);else mastered.add(id);
 try {localStorage.setItem(storeKey,JSON.stringify([...mastered]))} catch (_) { /* The current session still works. */ }
 writeProgress();
});
$('previous').addEventListener('click',()=>go(current-1));$('next').addEventListener('click',()=>go(current+1));
$('enlarge').addEventListener('click',()=>{ $('large-image').src=$('circuit').src;$('large-image').alt=$('circuit').alt;$('image-dialog').showModal(); });
$('close-dialog').addEventListener('click',()=>$('image-dialog').close());
buildNav();go(0);
