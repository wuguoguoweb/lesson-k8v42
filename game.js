// 保留舊程式網址，入口統一使用共用元件。
import {mountGame} from './shared/game-player.js';
mountGame(new URL('./lessons/dodge-exam/course.json',import.meta.url));
