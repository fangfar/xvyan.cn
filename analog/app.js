const all=groups.flatMap((group,groupIndex)=>group.items.map((item,index)=>({...item,groupIndex,index})));
const $=id=>document.getElementById(id);
const reviewKey=document.body.dataset.reviewKey;
const storeKey=reviewKey||'analog-review-mastered-v1';
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
  const section=document.createElement('details'); section.className='nav-group';
  const heading=document.createElement('summary'); heading.className='nav-heading'; heading.textContent=`${g.title}  ${g.topic}`; section.append(heading);
  const items=document.createElement('div'); items.className='nav-items';
  const optgroup=document.createElement('optgroup'); optgroup.label=`${g.title} · ${g.topic}`;
  g.items.forEach(q=>{
   const index=all.findIndex(x=>x.id===q.id); const button=document.createElement('button'); button.type='button'; button.className='nav-item'; button.dataset.id=q.id;
   const code=document.createElement('span');code.className='nav-code';code.textContent=q.navNumber??(q.id.includes('-')?q.id.split('-')[1].padStart(2,'0'):q.id);
   const label=document.createElement('span');label.textContent=q.title.replace(/^(第\s*\d+\s*题|简答\s*\d+|\d+\.\d+)\s*/, '');
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
 const breadcrumb=$('breadcrumb');
 if(breadcrumb) breadcrumb.innerHTML=`复习目录　/　${g.title}　/　<b>${g.topic}</b>`;
 $('question-title').textContent=q.title;
 $('question-subtitle').textContent=`${g.title} · ${g.topic}`;
 $('question-kind').textContent=q.kind;
 $('question-body').innerHTML=q.body??`<p>${q.description}</p>`;
 $('counter').textContent=`${String(current+1).padStart(2,'0')} / ${String(all.length).padStart(2,'0')}`;
 const hint=$('question-hint');
 if(hint){ hint.open=false; hint.hidden=!q.key; $('key-point').textContent=q.key||''; }
 $('question-select').value=String(current);
 const fig=$('circuit-figure');if(fig)fig.hidden=!q.image;
 if(q.image){
  const type=q.id==='4-1'||q.id==='4-2'?'特性曲线':q.id==='4-3'?'器件符号':'电路图';
  $('circuit').src=`images/${q.image}?v=20261119-review`;
  $('circuit').alt=`${q.title}的${type}`;
 }
 const options=$('options');options.replaceChildren();
 (q.options||[]).forEach((option,i)=>{
  const row=document.createElement('div');row.className='option';
  const label=document.createElement('b');label.className='option-letter';label.textContent=(q.optionLabels?.[i]??String.fromCharCode(65+i))+'.';
  if(reviewKey){
   const content=document.createElement('div');
   content.innerHTML=option;
   row.append(label,content);
  }else row.append(label,document.createTextNode(option));
  options.append(row);
 });
 $('steps').replaceChildren();q.steps.forEach((item,i)=>{const el=document.createElement('article');el.className='step';el.innerHTML=`<span class="step-index">${String(i+1).padStart(2,'0')}</span><div class="step-content"><h3>${item.title}</h3><div class="step-copy">${item.body}</div></div>`;$('steps').append(el)});
 document.querySelectorAll('.worked-figure, #answer-figure').forEach(figure=>{
  if (figure.querySelector('button')) return;
  const button=document.createElement('button');
  button.type='button';
  button.className='enlarge';
  button.textContent='放大查看解答图 ↗';
  button.addEventListener('click',()=>openImage(figure.querySelector('img')));
  figure.append(button);
 });
 const result=$('result');
 result.innerHTML=q.result;$('answer-source').textContent=q.source||'独立推导';
 if(reviewKey){
  const letter=q.result.trim();
  if(/^[A-D]$/.test(letter)){
   const correct=options.children[letter.charCodeAt(0)-65];
   if(correct) result.replaceChildren(correct.cloneNode(true));
  }
  document.querySelectorAll('#question-body img, #options img, #steps img, #result img').forEach(img=>{
   if(img.matches('.math-fallback')) return;
   if(img.closest('.worked-figure')) return;
   const button=document.createElement('button');
   button.type='button';button.className='image-button';
   if(img.classList.contains('review-figure')) button.classList.add('figure-button');
   button.setAttribute('aria-label',`放大查看${img.alt}`);
   button.addEventListener('click',()=>openImage(img));
   img.replaceWith(button);button.append(img);
  });
 }
 const answerFig=$('answer-figure');if(answerFig)answerFig.hidden=!q.answerImage;
 if(q.answerImage){$('answer-image').src=`images/${q.answerImage}?v=20261119-review`;$('answer-image').alt='稳压管输出限幅波形，标出上下限电压'}
 $('solution').hidden=true;$('show-answer').setAttribute('aria-expanded','false');$('show-answer').innerHTML='查看解答 <span aria-hidden="true">↗</span>';
 $('previous').disabled=current===0;$('next').disabled=current===all.length-1;
 $('pager-label').textContent=`${current+1} / ${all.length}`;
 document.querySelectorAll('.nav-item').forEach(btn=>{
  if(btn.dataset.id===q.id){
   btn.setAttribute('aria-current','page');
   btn.closest('details').open=true;
  }else btn.removeAttribute('aria-current');
 });
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
const imageDialog=$('image-dialog');
const imageScroll=imageDialog.querySelector('.image-scroll');
const zoomButton=$('zoom-image');

function setZoom(zoomed){
 imageDialog.classList.toggle('is-zoomed',zoomed);
 zoomButton.setAttribute('aria-pressed',String(zoomed));
 zoomButton.textContent=zoomed?'适应屏幕':'放大细节';
 $('image-hint').hidden=!zoomed;
 imageScroll.scrollTo(0,0);
}

function openImage(source){
 $('large-image').src=source.src;
 $('large-image').alt=source.alt;
 imageDialog.showModal();
 setZoom(false);
}

$('enlarge')?.addEventListener('click',()=>openImage($('circuit')));
zoomButton.addEventListener('click',()=>setZoom(zoomButton.getAttribute('aria-pressed')==='false'));
$('close-dialog').addEventListener('click',()=>imageDialog.close());
buildNav();go(0);
