var S=Object.defineProperty;var I=(n,e,t)=>e in n?S(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var a=(n,e,t)=>(I(n,typeof e!="symbol"?e+"":e,t),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const h of s)if(h.type==="childList")for(const r of h.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const h={};return s.integrity&&(h.integrity=s.integrity),s.referrerpolicy&&(h.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?h.credentials="include":s.crossorigin==="anonymous"?h.credentials="omit":h.credentials="same-origin",h}function i(s){if(s.ep)return;s.ep=!0;const h=t(s);fetch(s.href,h)}})();class M{constructor(){a(this,"_sprites");this._sprites=[]}get sprites(){return this._sprites}load(e,t){return new Promise(i=>{const s=new Image;s.onload=()=>{const h={image:s,type:t};i(h),this._sprites.push(h)},s.src=e})}getSprite(e){return this._sprites.find(t=>t.type===e)}}const w=[{id:0,src:"./src/images/dirt.png",collision:!1,muddyTerrain:!0,probability:.1},{id:1,src:"./src/images/grass.png",collision:!1,muddyTerrain:!1,probability:.7},{id:2,src:"./src/images/sand.png",collision:!1,muddyTerrain:!0,probability:.1},{id:3,src:"./src/images/treeSmall.png",collision:!0,muddyTerrain:!1,probability:.1}];class m{constructor(){a(this,"_map");a(this,"_height");a(this,"_width");a(this,"_tileSize");a(this,"_tiles");a(this,"_loader");this._height=8,this._width=12,this._tileSize=128,this._tiles=[],this._map=[],this._loader=new M}get mapWidth(){return this._width*this._tileSize}get mapHeight(){return this._height*this._tileSize}static getRandomTexture(e){const t=Math.random();let i=0;const s=e.length-1;for(let h=0;h<s;h++)if(i+=e[h].probability,t<i)return e[h];return e[s]}async loadMap(){for(let e=0;e<w.length;e++){const t=w[e],i=await this._loader.load(t.src,t.src),s={...t,image:i.image,id:t.id};this._tiles.push(s)}}generateRandomMap(){for(let e=0;e<this._height;e++){this._map[e]=[];for(let t=0;t<this._width;t++){const i=m.getRandomTexture(this._tiles);this._map[e].push(i)}}return this._map}drawMap(e){for(let t=0;t<this._height;t++)for(let i=0;i<this._width;i++){const s=this._map[t][i].id,h=this._tiles[s],r=i*h.image.width,o=t*h.image.height,l=h.image.width,c=h.image.height;h.image.width&&h.image.height!==this._tileSize&&(h.image.width=this._tileSize,h.image.height=this._tileSize),h.collision&&e.drawImage(this._tiles[1].image,r,o,l,c),e.drawImage(h.image,r,o,l,c)}}checkMapCollision(e){for(let t=0;t<this._map.length;t++)for(let i=0;i<this._map[t].length;i++){const s=this._map[t][i],h=i*this._tileSize,r=t*this._tileSize;if((s.collision||s.muddyTerrain)&&e.x<h+this._tileSize-20&&e.x+e.w>h+20&&e.y<r+this._tileSize-20&&e.h+e.y>r+20)return{collide:s.collision,muddy:s.muddyTerrain}}return{collide:!1,muddy:!1}}checkIfEntityOutsideMap(e,t){return e>this._width*this._tileSize||e<0||t>this._height*this._tileSize||t<0}}class u{constructor(e,t,i){a(this,"_x");a(this,"_y");a(this,"_w");a(this,"_h");a(this,"_angle");a(this,"_isHitted");a(this,"_image");this._image=i,this._x=e,this._y=t,this._w=0,this._h=0,this._angle=0,this._isHitted=!1,this._w=this._image.width,this._h=this._image.height}get x(){return this._x}get y(){return this._y}get angle(){return this._angle}get h(){return this._h}get w(){return this._w}get isHitted(){return this._isHitted}set isHitted(e){this._isHitted=e}}class y extends u{constructor(t,i,s){super(t,i,s);a(this,"_up");a(this,"_right");a(this,"_left");a(this,"_speed");a(this,"_angleSpeed");a(this,"_lastPosX");a(this,"_lastPosY");a(this,"_life");a(this,"_spawnProtect");a(this,"_detectionRadius");this._speed=1,this._angleSpeed=1,this._life=100,this._up=!1,this._right=!1,this._left=!1,this._lastPosX=0,this._lastPosY=0,this._spawnProtect=!1,this._detectionRadius=500,window.addEventListener("keydown",this.keysPressed.bind(this),!1),window.addEventListener("keyup",this.keysReleased.bind(this),!1)}get detectionRadius(){return this._detectionRadius}get life(){return this._life}set life(t){this._life=t}keysPressed(t){switch(t.key){case"z":this._up=!0;break;case"d":this._right=!0;break;case"q":this._left=!0;break}}keysReleased(t){switch(t.key){case"z":this._up=!1;break;case"d":this._right=!1;break;case"q":this._left=!1;break}}checkSpawnCollision(t){t.checkMapCollision(this).collide&&(this._spawnProtect=!0,setTimeout(()=>{this._spawnProtect=!1},2e3))}decreaseLifePoint(t){t.isHitted||(this._life-=t.damage,t.isHitted=!0)}move(t){if(this._up){const i=t.checkMapCollision(this),s=t.checkIfEntityOutsideMap(this._x,this._y);i.muddy?this._speed=.5:this._speed=1,(s||i.collide)&&!this._spawnProtect?(this._x=this._lastPosX,this._y=this._lastPosY):(this._lastPosX=this._x,this._lastPosY=this._y);const h=this._angle*(Math.PI/180),r=Math.cos(h)*this._speed,o=Math.sin(h)*this._speed;this._x+=r,this._y+=o}this._right&&(this._angle+=this._angleSpeed),this._left&&(this._angle-=this._angleSpeed),(this._angle>360||this._angle<-360)&&(this._angle=0)}draw(t){let i=this._life/100;i<=0&&(i=0),t.save(),t.strokeRect(this._x,this._y-15,this._w,this._h/3),t.fillStyle="#32CD32",t.fillRect(this._x,this._y-15,this._w*i,this._h/3),t.translate(this._x+this._w/2,this._y+this._h/2),t.rotate(this._angle*(Math.PI/180)),t.translate(-this._x-this._w/2,-this._y-this._h/2),t.drawImage(this._image,this._x,this._y,this._w,this._h),t.restore()}}class x extends u{constructor(t){super(t.x,t.y,t.src);a(this,"_speed");a(this,"_type");a(this,"_damage");this._speed=t.speed,this._angle=t.angle,this._type=t.type,this._damage=t.damage}get type(){return this._type}get damage(){return this._damage}update(t,i){const s=i.findIndex(g=>g._isHitted);s!==-1&&i.splice(s,1);const h=this.calculateAngle(this._type),r=Math.cos(h)*this._speed,o=Math.sin(h)*this._speed;this._x+=r,this._y+=o,t.checkIfEntityOutsideMap(this._x,this._y)&&(this._isHitted=!0),t.checkMapCollision(this).collide&&(this._isHitted=!0)}draw(t){t.save(),t.translate(this._x+this._w/2,this._y+this._h/2),t.rotate(this.calculateAngle(this._type)),t.translate(-this._x-this._w/2,-this._y-this._h/2),t.drawImage(this._image,this._x,this._y,this._w,this._h),t.restore()}calculateAngle(t){switch(t){case"hero":return this._angle*(Math.PI/180);case"enemy":return this._angle;default:return this._angle}}}function f(n,e){return n=Math.ceil(n),e=Math.floor(e),Math.floor(Math.random()*(e-n+1)+n)}class d extends u{constructor(t,i,s){super(t,i,s);a(this,"_speed");a(this,"_isMoving");a(this,"_cooldownFire");a(this,"_life");this._speed=.3,this._isMoving=!1,this._cooldownFire=!1,this._life=100}static spawn(t,i,s){for(let h=0;h<50;h+=1){const r=f(t.mapWidth/3,t.mapWidth*3),o=f(0,t.mapHeight*2);s.push(new d(r,o,i.getSprite("enemy").image))}}update(t,i){const s=i.findIndex(o=>o._life<=0);s!==-1&&i.splice(s,1),this._angle=Math.atan2(t.y-this._y,t.x-this._x);const h=Math.cos(this._angle)*this._speed,r=Math.sin(this._angle)*this._speed;this.enterInHeroArea(t)?this._isMoving=!1:(this._x+=h,this._y+=r,this._isMoving=!0)}enterInHeroArea(t){return Math.sqrt((this._x-t.x)*(this._x-t.x)+(this._y-t.y)*(this._y-t.y))<t.detectionRadius}decreaseLifePoint(t){t.isHitted||(this._life-=t.damage,t.isHitted=!0)}shoot(t,i){if(!this._isMoving&&!this._cooldownFire){const s=i.getSprite("shell").image,h=this._x+(this._w-s.width)/2,r=this._y+(this._h-s.height)/2,o=new x({type:"enemy",x:h,y:r,angle:this._angle,speed:.5,damage:30,src:s});t.push(o),this._cooldownFire=!0,setTimeout(()=>this._cooldownFire=!1,f(2500,5e3))}}draw(t){let i=this._life/100;i<=0&&(i=0),t.save(),t.strokeRect(this._x,this._y-15,this._w,this._h/3),t.fillStyle="#32CD32",t.fillRect(this._x,this._y-15,this._w*i,this._h/3),t.translate(this._x+this._w/2,this._y+this._h/2),t.rotate(this._angle),t.translate(-this._x-this._w/2,-this._y-this._h/2),t.drawImage(this._image,this._x,this._y,this._w,this._h),t.restore()}}const _=new M;async function v(){await _.load("./src/images/tankE.png","enemy"),await _.load("./src/images/obus.png","shell"),await _.load("./src/images/tank.png","hero")}class p{constructor(){a(this,"_mapCanvas");a(this,"_ctx");a(this,"_app");a(this,"_map");a(this,"_hero");a(this,"_enemies");a(this,"_shots");a(this,"_gameover");a(this,"_width");a(this,"_height");this._app=document.querySelector("#app"),this._mapCanvas=document.createElement("canvas"),this._ctx=this._mapCanvas.getContext("2d"),this._width=0,this._height=0,this._map=new m,this._enemies=[],this._shots=[],this._gameover=!1,this._hero=new y(100,100,_.getSprite("hero").image)}static collide(e,t){const i=e.x-t.x,s=e.y-t.y;return Math.abs(i)<e.w/2+t.w/2&&Math.abs(s)<e.h/2+t.h/2}restart(){this._gameover=!1,this._enemies=[],this._shots=[],this._hero=new y(100,100,_.getSprite("hero").image),this._hero.checkSpawnCollision(this._map),d.spawn(this._map,_,this._enemies)}async load(){var t;await this._map.loadMap(),this._map.generateRandomMap()&&(this._hero.checkSpawnCollision(this._map),this._mapCanvas.width=this._map.mapWidth,this._mapCanvas.height=this._map.mapHeight,(t=this._app)==null||t.appendChild(this._mapCanvas),d.spawn(this._map,_,this._enemies),window.addEventListener("click",async()=>{const i=_.getSprite("shell").image,s=this._hero.w,h=this._hero.h,r=i.width,o=i.height,{angle:l}=this._hero,c=this._hero.x+(s-r)/2,g=this._hero.y+(h-o)/2,k=new x({type:"hero",x:c,y:g,angle:l,speed:10,damage:50,src:i});this._shots.push(k)}))}update(){this._gameover&&this.restart(),this._ctx.clearRect(0,0,this._width,this._height),this._hero.move(this._map),this._enemies.length&&this._enemies.forEach(e=>{e.update(this._hero,this._enemies),e.shoot(this._shots,_)}),this._shots.length&&this._shots.forEach(e=>{e.update(this._map,this._shots),this._enemies.forEach(t=>{e.type==="hero"&&p.collide(e,t)?t.decreaseLifePoint(e):e.type==="enemy"&&p.collide(e,this._hero)&&(this._hero.decreaseLifePoint(e),this._hero.life<=0&&(this._gameover=!0))})})}draw(){this._map.drawMap(this._ctx),this._hero.draw(this._ctx),this._enemies.length&&this._enemies.forEach(e=>e.draw(this._ctx)),this._shots.length&&this._shots.forEach(e=>e.draw(this._ctx))}}(async()=>{await v();const n=new p;await n.load();async function e(){n.update(),n.draw(),window.requestAnimationFrame(e)}await e()})();