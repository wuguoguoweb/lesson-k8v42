import {showError} from './course.js';
try{
 const url=new URL(document.body.dataset.course,document.baseURI);
 if(document.body.dataset.view==='game')await (await import('./game-player.js')).mountGame(url);
 else await (await import('./tutorial-view.js')).mountTutorial(url);
}catch(error){showError(error);}
