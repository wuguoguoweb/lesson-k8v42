const status=document.querySelector('#status');
const host=document.querySelector('#project');
const controls=['start','stop','restart'].map(id=>document.getElementById(id));
let player;
async function init(){try{
 player=new Scaffolding.Scaffolding();player.width=480;player.height=360;player.resizeMode='preserve-ratio';player.setup();player.appendTo(host);
 player.vm.setCompilerOptions({enabled:false});player.vm.setFramerate(30);player.vm.setTurboMode(false);player.vm.setInterpolation(false);
 const response=await fetch('./project.sb3');if(!response.ok)throw new Error('找不到原始作品');
 await player.loadProject(await response.arrayBuffer());
 player.vm.runtime.on('PROJECT_RUN_STOP',()=>status.textContent='已停止。若碰到考卷，挑戰就結束了！按「重新開始」再試一次。');
 controls.forEach(b=>b.disabled=false);status.textContent='準備好了！按「開始」，再將滑鼠移入舞台。';
 window.gamePlayer=player;
}catch(error){console.error(error);status.textContent='載入失敗：'+error.message+'。請確認網路連線，重新整理再試。';}}
function start(){player.start();status.textContent='挑戰中：移動滑鼠，躲開考卷！';}
controls[0].onclick=start;controls[1].onclick=()=>player.stopAll();controls[2].onclick=()=>{player.stopAll();start();};
document.querySelector('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.querySelector('.game-panel').requestFullscreen();}catch{status.textContent='瀏覽器未允許全螢幕，仍可在目前大小遊玩。';}};
new ResizeObserver(()=>player?.relayout()).observe(host);
// Scaffolding caches its canvas rectangle. Refresh it when the page scrolls,
// otherwise pointer coordinates are offset by the scroll distance.
window.addEventListener('scroll',()=>player?.relayout(),{passive:true});
host.addEventListener('touchmove',event=>{event.preventDefault();const t=event.touches[0],r=host.getBoundingClientRect();player?.vm.postIOData('mouse',{x:t.clientX-r.left,y:t.clientY-r.top,canvasWidth:r.width,canvasHeight:r.height,isDown:true});},{passive:false});
host.addEventListener('touchend',()=>player?.vm.postIOData('mouse',{isDown:false}));
init();
