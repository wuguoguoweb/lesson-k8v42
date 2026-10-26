export function setupProjection(change){
 const button=document.querySelector('#projection');
 button.onclick=()=>{const on=document.body.classList.toggle('projection');button.textContent=on?'✕ 退出投影模式':'⛶ 開啟投影模式';button.setAttribute('aria-pressed',String(on));window.scrollTo(0,0);};
 document.addEventListener('keydown',e=>{
  if(!document.body.classList.contains('projection'))return;
  if(e.key==='Escape'){button.click();e.preventDefault();return;}
  if(['INPUT','BUTTON','SUMMARY','A'].includes(document.activeElement.tagName))return;
  if(e.key==='ArrowRight'){change(1);e.preventDefault();}if(e.key==='ArrowLeft'){change(-1);e.preventDefault();}
 });
}
