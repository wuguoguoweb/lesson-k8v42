import {loadCourse,loadLibrary,readJSON,escapeHTML as esc} from './course.js';
export async function mountGame(url){
 const {course:c,resolve}=await loadCourse(url),app=document.querySelector('#app');
 document.title=c.title+'｜開始遊戲';
 app.innerHTML=`<p class="eyebrow">PLAY / ${esc(c.title)}</p><h1>${esc(c.gameHeading||c.title)}</h1><p class="lead">${esc(c.summary)}</p><div class="game-layout"><section class="panel game-panel"><div class="toolbar"><button id="start" disabled>⚑ 開始</button><button id="stop" disabled class="secondary">■ 停止</button><button id="restart" disabled class="secondary">↻ 重新開始</button><button id="fullscreen" class="secondary">⛶ 全螢幕</button></div><div id="project" aria-label="${esc(c.title)}遊戲舞台"></div><p id="status" role="status">正在載入原始 Scratch 作品…</p></section><aside class="panel" id="game-info"></aside></div>`;
 const info=document.querySelector('#game-info');info.innerHTML=(await readJSON(resolve(c.content))).gameInfo;
 for(const link of info.querySelectorAll('a[href]'))link.href=resolve(link.getAttribute('href')).href;
 const status=document.querySelector('#status'),host=document.querySelector('#project'),controls=['start','stop','restart'].map(id=>document.getElementById(id));
 let player;
 try{
  await loadLibrary('scaffolding.js','Scaffolding');
  const options=c.player;player=new Scaffolding.Scaffolding();player.width=options.width;player.height=options.height;player.resizeMode='preserve-ratio';player.setup();player.appendTo(host);
  player.vm.setCompilerOptions({enabled:options.compiler});player.vm.setFramerate(options.fps);player.vm.setTurboMode(options.turbo);player.vm.setInterpolation(options.interpolation);
  const response=await fetch(resolve(c.project));if(!response.ok)throw Error('找不到原始作品');await player.loadProject(await response.arrayBuffer());
  player.vm.runtime.on('PROJECT_RUN_STOP',()=>status.textContent=c.stoppedMessage||'已停止。按「重新開始」再試一次。');
  controls.forEach(b=>b.disabled=false);status.textContent='準備好了！按「開始」，再將滑鼠移入舞台。';window.gamePlayer=player;
 }catch(error){console.error(error);status.textContent='載入失敗：'+error.message+'。請確認連線，重新整理再試。';return;}
 function start(){player.start();status.textContent=c.runningMessage||'遊戲進行中！';}
 controls[0].onclick=start;controls[1].onclick=()=>player.stopAll();controls[2].onclick=()=>{player.stopAll();start();};
 document.querySelector('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.querySelector('.game-panel').requestFullscreen();}catch{status.textContent='瀏覽器未允許全螢幕，仍可在目前大小遊玩。';}};
 new ResizeObserver(()=>player.relayout()).observe(host);window.addEventListener('scroll',()=>player.relayout(),{passive:true});
 host.addEventListener('touchmove',event=>{event.preventDefault();const t=event.touches[0],r=host.getBoundingClientRect();player.vm.postIOData('mouse',{x:t.clientX-r.left,y:t.clientY-r.top,canvasWidth:r.width,canvasHeight:r.height,isDown:true});},{passive:false});
 host.addEventListener('touchend',()=>player.vm.postIOData('mouse',{isDown:false}));
}
