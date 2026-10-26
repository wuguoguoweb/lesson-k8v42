import {loadCourse,loadLibrary,readJSON,siteURL,escapeHTML as esc} from './course.js';
import {createProgress} from './progress.js';
import {setupProjection} from './projection.js';
export async function mountTutorial(url){
 const {course:c,resolve}=await loadCourse(url);
 const [{lessons,stages,lessonCode},scripts,language,content]=await Promise.all([import(resolve(c.lessonData).href),readJSON(resolve(c.scripts)),readJSON(new URL('vendor/zh-tw.json',siteURL)),readJSON(resolve(c.content))]);
 await loadLibrary('scratchblocks.js','scratchblocks');scratchblocks.loadLanguages({zh_tw:language});
 document.title=c.title+'｜Scratch 逐步教學';document.body.classList.add('tutorial-page');
 const app=document.querySelector('#app');
 app.innerHTML=`<button class="secondary project-button" id="projection" aria-pressed="false">⛶ 開啟投影模式</button><section class="intro"><p class="eyebrow">MAKE / ${esc(c.title)}</p><h1>一起做出「${esc(c.title)}」</h1><p class="lead">${stages.length} 個階段、${lessons.length} 個小步驟。一次加一段，按綠旗試試看。</p><p>適合${esc(c.audience)} · ${esc(c.duration)}<br>本課會用到：${c.topics.map(esc).join('、')}。</p></section><div class="lesson-layout"><nav class="step-nav" aria-label="教學步驟" id="steps"></nav><div><article class="panel step-card" id="lesson" aria-live="polite"></article><div class="lesson-controls"><button id="previous" class="secondary">← 上一步</button><span id="counter"></span><button id="next">下一步 →</button></div><p id="saved" role="status"></p></div></div><section class="lesson-extra"><h2>素材與來源</h2><p>${esc(c.sourceNote)}</p></section>`;
 const templates=document.createElement('div');templates.innerHTML=content.extras;
 const card=document.querySelector('#lesson'),nav=document.querySelector('#steps'),saved=document.querySelector('#saved');
 const progress=createProgress(c,lessons.map(l=>l.id));let index=0;
 function renderNav(){
  nav.replaceChildren();stages.forEach((stage,s)=>{
   const group=document.createElement('div');group.className='stage-group';const heading=document.createElement('p');heading.className='stage-title';heading.textContent=`${s+1}. ${stage}`;group.append(heading);
   lessons.forEach((l,i)=>{if(l.stage!==s)return;const button=document.createElement('button');button.textContent=`${progress.has(l.id)?'✓ ':''}${l.id} ${l.title}`;if(i===index)button.setAttribute('aria-current','step');button.onclick=()=>{index=i;render();};group.append(button);});nav.append(group);
  });
 }
 function render(){
  const l=lessons[index];renderNav();
  card.innerHTML=`<p class="eyebrow">第 ${l.stage+1} 階段 / ${stages.length} · 小步驟 ${esc(l.id)}</p><h2>${esc(l.title)}</h2><p class="role-cue">現在點：<strong>${esc(l.target)}</strong></p><div class="progress"><span style="width:${(index+1)/lessons.length*100}%"></span></div>${l.back?`<p class="return-cue">↩ ${esc(l.back)}</p>`:''}<h3>動手做</h3><ol>${l.actions.map(a=>`<li>${esc(a)}</li>`).join('')}</ol>`;
  if(l.material){const box=document.createElement('div');box.className='materials';for(const [file,name] of c.materials[l.material]){const figure=document.createElement('figure');const src=resolve('assets/'+file).href;figure.innerHTML=`<img src="${esc(src)}" alt="${esc(name)}"><figcaption>${esc(name)}</figcaption><a class="text-link" href="${esc(src)}" download="${esc(file)}">儲存素材</a>`;box.append(figure);}card.append(box);}
  if(l.script!==undefined){
   const heading=document.createElement('h3');heading.textContent=`${scripts[l.script].target}｜${c.scriptLabels?.[l.script]||'這一步的程式'}`;
   const legend=document.createElement('p');legend.className='new-cue';legend.textContent='★ 新增：圖旁有星號的積木，就是這次要加的。';
   const wrap=document.createElement('div');wrap.className='block-image';wrap.setAttribute('role','img');wrap.setAttribute('aria-label',`${scripts[l.script].target}的程式：${lessonCode(l,scripts)}`);const pre=document.createElement('pre');pre.className='blocks';pre.textContent=lessonCode(l,scripts,true);wrap.append(pre);card.append(heading,legend,wrap);scratchblocks.renderMatching('#lesson pre.blocks',{style:'scratch3',languages:['zh_tw'],scale:1});
  }
  if(l.extra){const template=templates.querySelector(`#${l.extra}-content`);if(!template)throw Error('缺少課程提示');card.append(template.content.cloneNode(true));}
  const test=document.createElement('p');test.className='test-cue';test.textContent=`${l.script!==undefined?'⚑ 綠旗測試':'✓ 完成檢查'}：${l.check}`;card.append(test);
  const label=document.createElement('label');label.className='check';label.style.display='block';const input=document.createElement('input');input.type='checkbox';input.checked=progress.has(l.id);input.onchange=()=>{const ok=progress.set(l.id,input.checked);saved.textContent=ok?'完成紀錄已保存在這個瀏覽器。':'無法保存紀錄，仍可繼續學習。';renderNav();};label.append(input,document.createTextNode(' 我完成這一步了'));card.append(label);
  document.querySelector('#counter').textContent=`${index+1} / ${lessons.length}`;document.querySelector('#previous').disabled=index===0;document.querySelector('#next').disabled=index===lessons.length-1;
 }
 function change(delta){if(index+delta>=0&&index+delta<lessons.length){index+=delta;render();}}
 document.querySelector('#previous').onclick=()=>change(-1);document.querySelector('#next').onclick=()=>change(1);setupProjection(change);render();
}
