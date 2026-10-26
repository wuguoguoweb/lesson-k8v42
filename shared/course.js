export const siteURL=new URL('../',import.meta.url);
export const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function readJSON(url){const r=await fetch(url);if(!r.ok)throw Error('無法載入課程資料');return r.json();}
export async function readText(url){const r=await fetch(url);if(!r.ok)throw Error('無法載入課程內容');return r.text();}
export async function loadCourse(url){
 const configURL=new URL(url,siteURL),course=await readJSON(configURL);
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(course.id))throw Error('課程編號無效');
 return {course,url:configURL,resolve:ref=>new URL(ref,configURL)};
}
export function loadLibrary(name,globalName){
 if(window[globalName])return Promise.resolve();
 return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=new URL('../vendor/'+name,import.meta.url).href;s.onload=resolve;s.onerror=()=>reject(Error('程式庫載入失敗'));document.head.append(s);});
}
export function showError(error){console.error(error);document.querySelector('#app').textContent='載入失敗：'+error.message+'。請確認連線，再重新整理。';}
