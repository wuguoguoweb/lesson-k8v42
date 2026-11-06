// 同一課的新舊入口共用一份紀錄；不刪除或修改舊版紀錄。
export function createProgress(course,stepIds,storage){
 const key=`scratch-progress:${course.id}:v${course.version}`;
 const valid=value=>Array.isArray(value)?[...new Set(value.filter(id=>stepIds.includes(id)))]:[];
 let completed=[],available=true;
 try{
  storage=storage||window.localStorage;
  const saved=storage.getItem(key);
  if(saved!==null)completed=valid(JSON.parse(saved));
  else if(course.legacyProgressKey){
   completed=valid(JSON.parse(storage.getItem(course.legacyProgressKey)||'[]'));
   storage.setItem(key,JSON.stringify(completed));
  }else if(course.progressMigrations){
   const migrated=[];
   for(const migration of course.progressMigrations){
    const old=JSON.parse(storage.getItem(migration.key)||'[]');
    if(!Array.isArray(old))continue;
    for(const [id,required] of Object.entries(migration.steps))if(required.length&&required.every(previous=>old.includes(previous)))migrated.push(id);
   }
   completed=valid(migrated);storage.setItem(key,JSON.stringify(completed));
  }
 }catch{available=false;}
 return {key,has:id=>completed.includes(id),set(id,checked){
  completed=completed.filter(value=>value!==id);if(checked&&stepIds.includes(id))completed.push(id);
  try{storage.setItem(key,JSON.stringify(completed));available=true;}catch{available=false;}
  return available;
 }};
}
