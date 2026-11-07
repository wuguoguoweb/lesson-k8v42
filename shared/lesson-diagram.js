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
 if(d.kind==='flappy'){
  // Preserve the source SVG's costume centre and Scratch stage coordinates.
  const bird=(x=-120,y=0)=>image(d.actor,240+x-86*.35,180-y-106*.35,171.9279205203*.35,142.9760619998*.35);
  const pipe=(x,y=0)=>image(d.pipe,240+x-40,180-y-500,80,1000);
  const text=(x,y,t)=>`<text x="${x}" y="${y}" font-size="23" font-weight="bold" fill="#163f45" stroke="white" stroke-width="5" paint-order="stroke">${esc(t)}</text>`;
  const line=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#ad3457" stroke-width="4" stroke-dasharray="8 6"/>`;
  const monitor=n=>`<rect x="12" y="12" width="126" height="34" rx="8" fill="white" stroke="#e49028" stroke-width="3"/>${text(20,37,'分數 '+n)}`;
  const frame=(n,title,svg)=>panel(n,title,stage(svg,title));
  let panels=[],cols='diagram-three';
  if(d.scene==='gravity')panels=[frame(1,'空白鍵：速度設為 8',bird(-120,0)+arrow(148,190,148,90)+text(220,95,'向上')),frame(2,'持續減 1：上升變慢',bird(-120,75)+arrow(148,108,148,68)+text(220,95,'接近最高點')),frame(3,'速度變負數：往下落',bird(-120,20)+arrow(148,160,148,265)+text(220,240,'向下'))];
  else if(d.scene==='reset'){cols='diagram-two';panels=[frame(1,'結束後，再按綠旗',pipe(-100)+bird(-120,-120)+monitor(3)+text(180,90,'綠旗重新開始 →')),frame(2,'回起點，分數與速度歸零',bird()+monitor(0)+line(120,50,120,310)+text(155,170,'(−120, 0)')+text(175,215,'速度 0'))];}
  else if(d.scene==='relative')panels=[160,0,-160].map((x,i)=>frame(i+1,['水管從右邊來','水管繼續左移','小鳥的 x 都不變'][i],pipe(x)+bird()+arrow(Math.min(430,240+x),65,Math.max(25,150+x),65)+line(120,80,120,320)+text(15,345,'小鳥 x＝−120')));
  else if(d.scene==='height')panels=[70,0,-70].map((y,i)=>frame(i+1,'例：y＝'+y,pipe(70,y)+bird(-120,y)+line(270,180-y-80,380,180-y-80)+line(270,180-y+80,380,180-y+80)+text(16,340,'缺口高度相同')));
  else if(d.scene==='clones')panels=[frame(1,'本體隱藏，負責製造',`<g opacity=".22">${pipe(116,10)}</g>`+bird()+text(15,70,'淡色只用來標示隱藏本體')),frame(2,'分身顯示、向左移動',pipe(160,0)+bird()+arrow(430,70,260,70)+text(15,340,'每隔 2.2 秒再建立')),frame(3,'x＜−240，刪除分身',bird()+line(0,0,0,360)+text(15,95,'← 到左側門檻就刪除')+text(15,340,'不是等待整張圖完全離開'))];
  else if(d.scene==='score'){cols='diagram-two';panels=[frame(1,'還沒越線：0 分',pipe(-108,0)+bird()+line(120,0,120,360)+monitor(0)+text(160,330,'基準線 x＝−120')),frame(2,'水管中心越線：加 1',pipe(-124,0)+bird()+line(120,0,120,360)+monitor(1)+arrow(190,70,85,70)+text(160,330,'x＜−120，只加一次'))];}
  else if(d.scene==='ending'){cols='diagram-two';panels=[frame(1,'條件一：碰到水管',pipe(-120,0)+bird(-120,105)+text(190,170,'碰撞 → 結束')),frame(2,'條件二：y＜−165',bird(-120,-170)+line(0,345,480,345)+text(15,320,'小鳥中心低於 y＝−165')+text(190,120,'落地 → 結束'))];}
  else throw Error('未知飛翔小鳥圖解：'+d.scene);
  body=`<div class="diagram-sequence ${cols}">${panels.join('')}</div><p class="diagram-coordinate">教學示意：箭頭、虛線與標籤不會出現在原遊戲中。</p>`;
 }else if(d.kind==='broadcast'){
  body=`<div class="diagram-broadcast"><div class="diagram-sender"><span aria-hidden="true">📣</span><strong>按空白鍵</strong><span>廣播「${esc(d.message)}」</span></div><div class="diagram-receivers">${d.receivers.map(r=>`<div class="diagram-receiver"><span aria-hidden="true">→</span><div><strong>${esc(r.name)}</strong><p>${esc(r.detail)}</p></div></div>`).join('')}</div></div>`;
 }else if(d.kind==='monitor'){
  body=`<div class="diagram-monitor-layout"><div class="diagram-variable-list"><p>變數清單（示意）</p><p><span class="diagram-tick" aria-hidden="true">✓</span> ${esc(d.variable)} <small>顯示</small></p>${d.hiddenVariable?`<p><span class="diagram-tick is-off" aria-hidden="true"></span> ${esc(d.hiddenVariable)} <small>不顯示</small></p>`:''}</div><div class="diagram-stage-wrap">${stage('',`${d.variable}顯示在舞台右上角`)}<div class="diagram-monitor"><span>${esc(d.variable)}</span><strong>${esc(d.value)}</strong></div></div></div>`;
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
