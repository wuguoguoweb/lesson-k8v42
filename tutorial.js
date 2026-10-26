import {lessons,stages,lessonCode} from './lesson-data.js';
const card=document.querySelector('#lesson'),nav=document.querySelector('#steps'),saved=document.querySelector('#saved');
// 新課綱有不同的小步驟，與舊版完成紀錄分開保存。
const progressKey='dodge-exam-progress-v2';
let index=0,completed=[],scripts=[];
try{const value=JSON.parse(localStorage.getItem(progressKey)||'[]');if(Array.isArray(value))completed=value.filter(id=>lessons.some(l=>l.id===id));}catch{}
function persist(){try{localStorage.setItem(progressKey,JSON.stringify(completed));saved.textContent='完成紀錄已保存在這個瀏覽器。';}catch{saved.textContent='無法保存紀錄，仍可繼續學習。';}}
const materials={
 tatiana:[['4eec0e1db92b8dea3e5bee25105e8f46.png','座標格線背景'],['5cf65a9f942ca92c93915527ff9db1e6.svg','Tatiana-a'],['91fb7d056beaf553ccec03d61d72c545.svg','Tatiana-b'],['e207fd3f99e1db8c5d66f49446f27e37.svg','Tatiana-c'],['e2ea6bbc6066574d4836e808a1c5f849.svg','Tatiana-d']],
 exam:[['b60090739bc8b1c3f176859c6df0dc06.svg','考卷 SVG']]
};
function renderNav(){
 nav.replaceChildren();
 stages.forEach((stage,s)=>{
  const group=document.createElement('div');group.className='stage-group';
  const heading=document.createElement('p');heading.className='stage-title';heading.textContent=`${s+1}. ${stage}`;group.append(heading);
  lessons.forEach((l,i)=>{if(l.stage!==s)return;
   const b=document.createElement('button');b.textContent=`${completed.includes(l.id)?'✓ ':''}${l.id} ${l.title}`;
   if(i===index)b.setAttribute('aria-current','step');
   b.onclick=()=>{index=i;render();};group.append(b);
  });nav.append(group);
 });
}
function render(){
 const l=lessons[index];renderNav();
 card.innerHTML=`<p class="eyebrow">第 ${l.stage+1} 階段 / 8 · 小步驟 ${l.id}</p><h2>${l.title}</h2><p class="role-cue">現在點：<strong>${l.target}</strong></p><div class="progress"><span style="width:${(index+1)/lessons.length*100}%"></span></div>${l.back?`<p class="return-cue">↩ ${l.back}</p>`:''}<h3>動手做</h3><ol>${l.actions.map(a=>`<li>${a}</li>`).join('')}</ol>`;
 if(l.material){const box=document.createElement('div');box.className='materials';
  for(const [file,name] of materials[l.material]){const figure=document.createElement('figure');figure.innerHTML=`<img src="assets/${file}" alt="${name}"><figcaption>${name}</figcaption><a class="text-link" href="assets/${file}" download="${file}">儲存素材</a>`;box.append(figure);}card.append(box);
 }
 if(l.script!==undefined){
  const heading=document.createElement('h3');heading.textContent=`${scripts[l.script].target}｜${l.script===1?'第二段：動畫':'這一步的程式'}`;
  const legend=document.createElement('p');legend.className='new-cue';legend.textContent='★ 新增：圖旁有星號的積木，就是這次要加的。';
  const wrap=document.createElement('div');wrap.className='block-image';wrap.setAttribute('role','img');wrap.setAttribute('aria-label',`${scripts[l.script].target}的程式：${lessonCode(l,scripts)}`);
  const pre=document.createElement('pre');pre.className='blocks';pre.textContent=lessonCode(l,scripts,true);wrap.append(pre);card.append(heading,legend,wrap);
  scratchblocks.renderMatching('#lesson pre.blocks',{style:'scratch3',languages:['zh_tw'],scale:1});
 }
 if(l.extra)card.append(document.querySelector(`#${l.extra}-content`).content.cloneNode(true));
 const test=document.createElement('p');test.className='test-cue';test.textContent=`${l.script!==undefined?'⚑ 綠旗測試':'✓ 完成檢查'}：${l.check}`;card.append(test);
 const label=document.createElement('label');label.className='check';label.style.display='block';const input=document.createElement('input');input.type='checkbox';input.checked=completed.includes(l.id);
 input.onchange=()=>{completed=completed.filter(id=>id!==l.id);if(input.checked)completed.push(l.id);persist();renderNav();};label.append(input,document.createTextNode(' 我完成這一步了'));card.append(label);
 document.querySelector('#counter').textContent=`${index+1} / ${lessons.length}`;document.querySelector('#previous').disabled=index===0;document.querySelector('#next').disabled=index===lessons.length-1;
}
function change(delta){if(index+delta>=0&&index+delta<lessons.length){index+=delta;render();}}
document.querySelector('#previous').onclick=()=>change(-1);document.querySelector('#next').onclick=()=>change(1);
const projection=document.querySelector('#projection');projection.onclick=()=>{const on=document.body.classList.toggle('projection');projection.textContent=on?'✕ 退出投影模式':'⛶ 開啟投影模式';projection.setAttribute('aria-pressed',String(on));window.scrollTo(0,0);};
document.addEventListener('keydown',e=>{
 if(!document.body.classList.contains('projection'))return;
 if(e.key==='Escape'){projection.click();e.preventDefault();return;}
 if(['INPUT','BUTTON','SUMMARY','A'].includes(document.activeElement.tagName))return;
 if(e.key==='ArrowRight'){change(1);e.preventDefault();}if(e.key==='ArrowLeft'){change(-1);e.preventDefault();}
});
try{const responses=await Promise.all([fetch('scripts.json'),fetch('vendor/zh-tw.json')]);if(responses.some(r=>!r.ok))throw Error('教學資料讀取失敗');scripts=await responses[0].json();scratchblocks.loadLanguages({zh_tw:await responses[1].json()});render();}catch(error){console.error(error);card.textContent='教學載入失敗，請確認網路連線，再重新整理。';}
