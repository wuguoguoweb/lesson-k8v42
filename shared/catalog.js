import {siteURL,readJSON,loadCourse,escapeHTML as esc} from './course.js';
try{
 const registry=await readJSON(new URL('courses.json',siteURL)),list=document.querySelector('#courses');list.replaceChildren();
 for(const entry of registry.courses){
  const {course:c,resolve}=await loadCourse(new URL(entry.config,siteURL));
  const article=document.createElement('article');article.className='panel course-card';
  article.innerHTML=`<div class="course-cover"><img src="${esc(resolve(c.cover).href)}" alt="${esc(c.title)}角色"></div><div><p class="eyebrow">SCRATCH 課程</p><h2>${esc(c.title)}</h2><p>${esc(c.summary)}</p><p class="note">${esc(c.audience)} · ${esc(c.duration)}</p><p>${c.topics.map(t=>`<span class="tag">${esc(t)}</span>`).join(' ')}</p><div class="actions"><a class="button" href="${esc(new URL(entry.game,siteURL).href)}">⚑ 開始遊戲 →</a><a class="button secondary" href="${esc(new URL(entry.tutorial,siteURL).href)}">▧ Scratch 教學</a></div></div>`;list.append(article);
 }
}catch(error){console.error(error);document.querySelector('#courses').textContent='課程載入失敗，請重新整理。';}
