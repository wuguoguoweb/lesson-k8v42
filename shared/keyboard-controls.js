// Optional per-course adapter: send ordinary Scratch keyboard input; never change scripts.
export function mountKeyboardControls(player,panel){
 const box=document.createElement('section');box.className='keyboard-controls';box.setAttribute('aria-label','觸控鍵盤');
 box.innerHTML='<p>手機／平板：按住方向鍵移動。先按綠旗，再按空白鍵開始。</p><div class="key-pad"><button type="button" data-key=" " class="space-key">空白鍵開始</button><button type="button" data-key="ArrowUp" aria-label="向上">↑</button><button type="button" data-key="ArrowLeft" aria-label="向左">←</button><button type="button" data-key="ArrowDown" aria-label="向下">↓</button><button type="button" data-key="ArrowRight" aria-label="向右">→</button></div>';
 panel.append(box);
 const pointers=new Map(),timers=new Set();
 const send=(key,isDown)=>player.vm.postIOData('keyboard',{key,isDown});
 function release(id){const key=pointers.get(id);if(key===undefined)return;pointers.delete(id);if(![...pointers.values()].includes(key))send(key,false);}
 function releaseAll(){for(const id of [...pointers.keys()])release(id);for(const timer of timers)clearTimeout(timer);timers.clear();for(const key of [' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'])send(key,false);}
 for(const button of box.querySelectorAll('button')){
  button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);pointers.set(e.pointerId,button.dataset.key);send(button.dataset.key,true);});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,e=>release(e.pointerId));
  // Keyboard and assistive-technology activation gets a short key press.
  button.addEventListener('click',e=>{if(e.detail!==0)return;const key=button.dataset.key;send(key,true);const timer=setTimeout(()=>{send(key,false);timers.delete(timer);},100);timers.add(timer);button.blur();});
 }
 window.addEventListener('blur',releaseAll);document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseAll();});
 return releaseAll;
}
