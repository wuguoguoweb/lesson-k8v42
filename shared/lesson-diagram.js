import {escapeHTML as esc} from './course.js';
let sequence=0;
// Reusable, static Scratch diagrams. Course data supplies all assets and labels.
export function renderDiagram(d,resolve){
 const asset=name=>esc(resolve('assets/'+name).href);
 const image=(name,x,y,w,h)=>`<image href="${asset(name)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;
 const stage=(body,label)=>`<svg class="diagram-stage" viewBox="0 0 480 360" role="img" aria-label="${esc(label)}"><image href="${asset(d.background)}" width="480" height="360"/>${body}</svg>`;
 const arrow=(x1,y1,x2,y2)=>{const id='diagram-arrow-'+(++sequence);return `<defs><marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#126e61"/></marker></defs><path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="#126e61" stroke-width="8" stroke-linecap="round" marker-end="url(#${id})"/>`;};
 const panel=(number,title,body)=>`<div class="diagram-panel"><p class="diagram-panel-title"><span class="diagram-number">${number}</span> ${esc(title)}</p>${body}</div>`;
 let body;
 if(d.kind==='monitor'){
  body=`<div class="diagram-monitor-layout"><div class="diagram-variable-list"><p>變數清單（示意）</p><p><span class="diagram-tick" aria-hidden="true">✓</span> ${esc(d.variable)} <small>顯示</small></p><p><span class="diagram-tick is-off" aria-hidden="true"></span> ${esc(d.hiddenVariable)} <small>不顯示</small></p></div><div class="diagram-stage-wrap">${stage('',`${d.variable}顯示在舞台右上角，${d.hiddenVariable}不顯示`)}<div class="diagram-monitor"><span>${esc(d.variable)}</span><strong>${esc(d.value)}</strong></div></div></div>`;
 }else if(d.kind==='bounce'){
  const edge='<path d="M468 12V348" stroke="#126e61" stroke-width="8" stroke-dasharray="10 8"/><text x="448" y="330" text-anchor="end" font-size="24" font-weight="bold" fill="#203c40">舞台邊緣</text>';
  body=`<div class="diagram-sequence diagram-two">${panel(1,d.labels[0],stage(edge+image(d.actor,65,60,110,90)+arrow(185,106,438,106),d.labels[0]))}${panel(2,d.labels[1],stage(edge+image(d.actor,365,60,110,90)+arrow(355,106,185,106),d.labels[1]))}</div>`;
 }else if(d.kind==='collision'){
  const [x,y]=d.start,px=240+x,py=180-y;
  const actors=`<div class="diagram-collision-actors"><img src="${asset(d.actor)}" alt="${esc(d.actorName)}"><svg viewBox="0 0 40 50" aria-hidden="true"><path d="M23 2L6 29H21L16 48L36 19H22Z" fill="#ed9829"/></svg><img src="${asset(d.hazard)}" alt="${esc(d.hazardName)}"></div>`;
  const values=`<div class="diagram-values"><span><small>${esc(d.variable)}</small><strong>${esc(d.before)}</strong></span><b aria-label="減一後">→</b><span><small>${esc(d.variable)}</small><strong>${esc(d.after)}</strong></span></div>`;
  const reset=stage(`<circle cx="${px}" cy="${py}" r="36" fill="#fff0bd" stroke="#126e61" stroke-width="4" stroke-dasharray="7 5"/>`+image(d.actor,px-36,py-36,72,72),`${d.actorName}回到起點 x ${x}，y ${y}`);
  body=`<div class="diagram-sequence diagram-three">${panel(1,d.labels[0],actors)}${panel(2,d.labels[1],values)}${panel(3,d.labels[2],reset+`<p class="diagram-coordinate">起點（${x}，${y}）</p>`)}</div>`;
 }else throw Error('未知圖解類型：'+d.kind);
 const figure=document.createElement('figure');figure.className='lesson-diagram';figure.dataset.kind=d.kind;
 figure.innerHTML=`<h3>程式小圖解</h3>${body}<figcaption>${esc(d.caption)}</figcaption>`;
 return figure;
}
