function drawUI(){
    Canvas.ctx.font = '25px Georgia';
    Canvas.ctx.fillStyle = 'rgb(200,200,200)';
    Canvas.ctx.fillRect(0,0,200,75);
    Canvas.ctx.stroke = 'black';
    Canvas.ctx.lineWidth = 3;
    Canvas.ctx.strokeRect(0,0,200,75);
    Canvas.ctx.fillStyle = 'black';
    Canvas.ctx.fillText("Health: " + player.health, 25,37.5);
    Canvas.ctx.fillText("Cash: " + player.money, 25,62.5);
    // Canvas.ctx.fillText(waveTracker.waves, 200,200);
}

function getDistance(target1,target2){
    return Math.sqrt(Math.pow(target2.position.x-target1.position.x,2)+Math.pow(target2.position.y-target1.position.y,2));
}

function playerMovement(player){
    if(keysDown.has('f')){
        player.doAbility();
    }
    if(keysDown.has('ArrowUp') || keysDown.has('w')){
        player.velocity.y = -player.speed;
        if(keysDown.has('ArrowRight') || keysDown.has('d')){
            player.velocity.normalize(player.speed,-45);
            return;
        }
        if(keysDown.has('ArrowLeft' || keysDown.has('a'))){
            player.velocity.normalize(player.speed,-135);
            return;
        }
    }
    else if(keysDown.has('ArrowDown') || keysDown.has('s')){
        player.velocity.y = player.speed;
        if(keysDown.has('ArrowRight') || keysDown.has('d')){
            player.velocity.normalize(player.speed,45);
            return;
        }
        if(keysDown.has('ArrowLeft') || keysDown.has('a')){
            player.velocity.normalize(player.speed,135);
            return;
        }
    }
    else{
        player.velocity.y = 0;
    }

    if(keysDown.has('ArrowRight') || keysDown.has('d')){
        player.velocity.x = player.speed;
    }
    else if(keysDown.has('ArrowLeft') || keysDown.has('a')){
        player.velocity.x = -player.speed;
    }
    else{
        player.velocity.x = 0;
    }
}

function getAngle(target1,target2){
    if(target2.position.x-target1.position.x >= 0){
        return toDeg(Math.atan((target2.position.y-target1.position.y)/(target2.position.x-target1.position.x)));
    }
    if(target2.position.x-target1.position.x < 0){
        return 180+toDeg(Math.atan((target2.position.y-target1.position.y)/(target2.position.x-target1.position.x)));
    }
}

class Position{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

class Size{
    constructor(w,h){
        this.w = w;
        this.h = h;
    }
}

class Vector{
    constructor(x=0,y=0){
        this.x = x;
        this.y = y;
    }
    normalize(velocity,angle){
        this.x = velocity*Math.cos(toRad(angle));
        this.y = velocity*Math.sin(toRad(angle));
    }
}

class EnemyTracker{
    constructor(){
        this.enemiesList = [];
        this.enemiesAlive = 0;
        this.ids = 0;
    }
    drawAll(){
        let enemies = this.enemiesList;
        for(let i = 0; i < enemies.length; i++){
            try{
                enemies[i].draw();
            }
            catch{
                continue;
            }
        }
    }
    simulateAll(){
        let enemies = this.enemiesList;
        this.enemiesAlive = 0;
        for(let i = 0; i < enemies.length; i++){
            try{
                enemies[i].checkHit();
                enemies[i].move();
                if(enemies[i].alive){
                    this.enemiesAlive++;
                }
            }
            catch{
                continue;
            }
        }
    }
}

class Enemy{
    constructor(position,size,speed,img,health,behavior){
        this.id = enemyTracker.ids;
        enemyTracker.ids++;
        this.position = position;
        this.index = enemyTracker.enemiesList.length;
        this.size = size;
        this.speed = speed;
        this.velocity = new Vector();
        this.img = img;
        this.behavior = new Set();
        this.health = health;
        this.time = 0;
        this.alive = true;
        for(let i = 0; i < behavior.length; i++){
            this.behavior.add(behavior[i]);
        }
        enemyTracker.enemiesList.push(this);
    }
    checkHit(){
        if(this.alive)
        {
            for(let i = 0; i < bulletTracker.bullets.length; i++){
                try{
                    let bullet = bulletTracker.bullets[i];
                    if((bullet.position.x + bullet.size.w/2) >= (this.position.x-this.size.w/2) && (bullet.position.x-bullet.size.w/2) <= (this.position.x+this.size.w/2) && (bullet.position.y + bullet.size.h/2) >= (this.position.y - this.size.h/2) && (bullet.position.y-bullet.size.h/2) <= (this.position.y+this.size.h/2) && bullet.exists && bullet.tags == 'player'){
                        bullet.delete();
                        this.health--;
                    }
                }
                catch{
                    continue;
                }
            }
            let bullet = player;
            if((bullet.position.x + bullet.size.w/4) >= (this.position.x-this.size.w/2) && (bullet.position.x-bullet.size.w/4) <= (this.position.x+this.size.w/2) && (bullet.position.y + bullet.size.h/4) >= (this.position.y - this.size.h/2) && (bullet.position.y-bullet.size.h/4) <= (this.position.y+this.size.h/2) && bullet.iFrame <= 0){
                player.health--;
                player.iFrame = 50;
            }
            if(this.health <= 0){
                this.alive = false;
                this.delete();
            }
        }
    }
    draw(){
        if(this.alive){
            Canvas.fillRect(this.position.x,this.position.y,this.size.w,this.size.h,'#000000',0);
        }
    }
    move(){
        if(this.alive){
            this.time++;
            if(this.behavior.has('line move')){
                this.velocity.normalize(this.speed,getAngle(this,player));
            }
            if(this.behavior.has('reverse accelerate')){
                this.speed = getDistance(this,player)/100;
            }
            if(this.behavior.has('slinger')){
                if(this.position.x > player.position.x){
                    this.velocity.x -= this.speed;
                }
                if(this.position.x < player.position.x){
                    this.velocity.x += this.speed;
                }
                if(this.position.y > player.position.y){
                    this.velocity.y -= this.speed;
                }
                if(this.position.y < player.position.y){
                    this.velocity.y += this.speed;
                }
            }
            if(this.behavior.has('UL loop')){
                this.velocity.x = this.speed*Math.sin(this.speed*this.time/(600));
                this.velocity.y = this.speed*Math.cos(this.speed*this.time/(300));
            }
            if(this.behavior.has('UR loop')){
                this.velocity.x = -this.speed*Math.sin(this.speed*this.time/(600));
                this.velocity.y = this.speed*Math.cos(this.speed*this.time/(300));
            }
            if(this.behavior.has('DR loop')){
                this.velocity.x = -this.speed*Math.sin(this.speed*this.time/(600));
                this.velocity.y = -this.speed*Math.cos(this.speed*this.time/(300));
            }
            if(this.behavior.has('DL loop')){
                this.velocity.x = this.speed*Math.sin(this.speed*this.time/(600));
                this.velocity.y = -this.speed*Math.cos(this.speed*this.time/(300));
            }
            if(!this.behavior.has('no borders')){
                if(this.position.x+this.size.w/2 >= 1600){
                    this.velocity.x = 0;
                    this.position.x = 1600-this.size.w/2 - 1
                }
                if(this.position.x-this.size.w/2 <= 0){
                    this.velocity.x = 0;
                    this.position.x = this.size.w/2 + 1
                }

                if(this.position.y+this.size.h/2 >= 900){
                    this.velocity.y = 0;
                    this.position.y = 900-this.size.h/2 - 1
                }
                if(this.position.y-this.size.h/2 <= 0){
                    this.velocity.y = 0;
                    this.position.y = this.size.h/2 + 1
                }
            }else{
                if(this.position.x+this.size.w/2 >= 1700){
                    this.health = 0;
                }
                if(this.position.x-this.size.w/2 <= -100){
                    this.health = 0;
                }

                if(this.position.y+this.size.h/2 >= 1000){
                    this.health = 0;
                }
                if(this.position.y-this.size.h/2 <= -100){
                    this.health = 0;
                }
            }
            if(this.behavior.has('UR curve')){
                this.velocity.x = this.speed;
                this.velocity.y -= this.speed*this.time/2000;
            }
            if(this.behavior.has('DR curve')){
                this.velocity.x = this.speed;
                this.velocity.y += this.speed*this.time/2000;
            }
            if(this.behavior.has('UL curve')){
                this.velocity.x = -this.speed;
                this.velocity.y -= this.speed*this.time/2000;
            }
            if(this.behavior.has('DL curve')){
                this.velocity.x = -this.speed;
                this.velocity.y += this.speed*this.time/2000;
            }
            if(this.behavior.has('shoot1')){
                if(this.time%100 == 0){
                    new Bullet(new Position(this.position.x, this.position.y),15,new Size(50,5),getAngle(this,player),'enemy');
                }
            }
            if(this.behavior.has('shoot down') || this.behavior.has('shoot omni')){
                if(this.time%50 == 0){
                    new Bullet(new Position(this.position.x, this.position.y),15,new Size(50,5),90,'enemy');
                }
            }
            if(this.behavior.has('shoot right') || this.behavior.has('shoot omni')){
                if(this.time%50 == 0){
                    new Bullet(new Position(this.position.x, this.position.y),15,new Size(50,5),0,'enemy');
                }
            }
            if(this.behavior.has('shoot left') || this.behavior.has('shoot omni')){
                if(this.time%50 == 0){
                    new Bullet(new Position(this.position.x, this.position.y),15,new Size(50,5),180,'enemy');
                }
            }
            if(this.behavior.has('shoot up') || this.behavior.has('shoot omni')){
                if(this.time%50 == 0){
                    new Bullet(new Position(this.position.x, this.position.y),15,new Size(50,5),-90,'enemy');
                }
            }
            if(this.behavior.has('move down')){
                this.velocity.y = 5;
            }
            if(this.behavior.has('move up')){
                this.velocity.y = -5;
            }
            if(this.behavior.has('move left')){
                this.velocity.x = -5;
            }
            if(this.behavior.has('move right')){
                this.velocity.x = 5;
            }
            if(this.behavior.has('cos x')){
                this.velocity.x = Math.abs(this.speed)*Math.cos(this.time/this.speed);
            }
            if(this.behavior.has('sin y')){
                this.velocity.y = Math.abs(this.speed)*Math.sin(this.time/this.speed);
            }

            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
    }
    delete(){
        for(let i = 0; i < enemyTracker.enemiesList.length; i++){
            if(this.id == enemyTracker.enemiesList[i].id){
                try{
                    player.money++;
                    enemyTracker.enemiesList.splice(i,1);
                }
                catch{
                    return;
                }
            }
        }
    }
}

class WaveEnemy{
    constructor(position,size,speed,img,health,...behavior){
        this.position = position;
        this.size = size;
        this.speed = speed;
        this.img = img;
        this.behavior = behavior;
        this.health = health;
        this.alive = true;
    }
    spawn(){
        new Enemy(new Position(this.position.x,this.position.y),new Size(this.size.w,this.size.h),this.speed,this.img,this.health,this.behavior)
    }
}

class Player{
    constructor(position,size,speed){
        this.position = position;
        this.size = size;
        this.velocity = new Vector(0,0);
        this.speed = speed;
        this.rotation = 0;

        this.shotCD = 100;
        this.canShoot = true;

        this.ability = function(){
            player.position.x = mouse.position.x;
            player.position.y = mouse.position.y;
        };
        this.abilityCD = 1;
        this.canAbility = true;
        this.bulletCount = 0;
        this.health = 10;
        this.iFrame = 0;

        this.money = 0;
    }
    async fireShot(){
        if(player.health <= 0){
            return;
        }
        if(this.canShoot){
            new Bullet(new Position(this.position.x,this.position.y),25,new Size(50,5),this.rotation,'player');
            this.canShoot = false;
            await wait(this.shotCD);
            this.canShoot = true;
        }
    }
    async doAbility(){
        if(player.health <= 0){
            return;
        }
        if(this.canAbility){
            this.canAbility = false;
            this.ability();
            await wait(this.abilityCD*1000)
            this.canAbility = true;
        }
    }
    draw(){
        if(player.health > 0){
            Canvas.drawImage(elm('player.png'),this.position.x,this.position.y,this.size.w,this.size.h,this.rotation+90);
        }
    }
    move(){
        if(player.health <= 0){
            return;
        }
        this.iFrame--;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.position.x - this.size.w/2 < 0){
            this.position.x = this.size.w/2;
        }
        if(this.position.x + this.size.w/2 > 1600){
            this.position.x = 1600 - this.size.w/2;
        }
        if(this.position.y - this.size.h/2 < 0){
            this.position.y = this.size.h/2;
        }
        if(this.position.y + this.size.h/2 > 900){
            this.position.y = 900 - this.size.h/2;
        }

    }
}

class Bullet{
    constructor(position,speed,size,direction,tag){
        this.position = position;
        this.id = bulletTracker.count;
        this.velocity = new Vector();
        this.velocity.normalize(speed,direction);
        this.size = size;
        this.direction = direction;
        this.properties = new Set();
        this.tags = tag;
        this.exists = true;
        bulletTracker.bullets.push(this);
        bulletTracker.count++;
    }
    addProperties(...property){
        for(let i = 0; i < property.length; i++){
            this.properties.add(property);
        }
    }
    removeProperties(...property){
        for(let i = 0; i < property.length; i++){
            this.properties.remove(property);
        }
    }
    move(){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.position.x < -50 || this.position.x > 1650 || this.position.y < -50 || this.position.y > 950){
            this.delete();
        }
    }
    draw(){
        let color = 'black';
        if(this.tags == 'player'){
            color = 'green';
        }
        if(this.tags == 'enemy'){
            color = 'red';
            if(this.position.x > player.position.x - player.size.w/2 && this.position.x < player.position.x + player.size.w/2 && this.position.y < player.position.y + player.size.h/2 && this.position.y > player.position.y - player.size.h/2){
                if(player.iFrame <= 0){
                    player.health--;
                    player.iFrame = 50;
                }
                this.delete();
            }
        }
        Canvas.fillRect(this.position.x,this.position.y,this.size.w,this.size.h,color,this.direction);
    }
    delete(){
        for(let i = 0; i < bulletTracker.bullets.length; i++){
            if(bulletTracker.bullets[i].id == this.id){
                bulletTracker.bullets.splice(i,1);
            }
        }
    }
}

class BulletTracker{
    constructor(){
        this.bullets = [];
        this.count = 0;
    }
    simulateAll(){
        for(let i = 0; i < this.bullets.length; i++){
            this.bullets[i].move();
        }
    }
    drawAll(){
        for(let i = 0; i < this.bullets.length; i++){
            this.bullets[i].draw();
        }
    }
}

class Mouse{
    constructor(){
        this.position = new Position(0,0)
        this.down = false;
    }
}

class Wave{
    constructor(...miniWave){
        this.miniWaves = miniWave;
        this.miniWaves.push(['conditional',function(){return enemyTracker.enemiesAlive == 0}])
        this.stage = 0;
        this.spawning = false;
        this.repeat = 0;
        waveTracker.waves.push(this);
    }
    async spawn(){
        if(this.stage >= this.miniWaves.length-1 || this.spawning){
            return;
        }
        let wave = this.miniWaves[this.stage];
        if(wave[0] == 'conditional'){
            if(wave[1]()){
                this.stage++;
                for(let i1 = 2; i1 < wave.length; i1++){
                    if(typeof(wave[i1]) == 'number'){
                        await wait(wave[i1]);
                        continue;
                    }
                    wave[i1].spawn();
                }
            }
        }

        if(wave[0] == 'delay'){
            this.spawning = true;
            await wait(wave[1])
            for(let i1 = 2; i1 < wave.length; i1++){
                if(typeof(wave[i1]) == 'number'){
                    await wait(wave[i1]);
                    continue;
                }
                wave[i1].spawn();
            }
            this.spawning = false;
            this.stage++;
        }

        if(wave[0] == 'repeatConditional'){
            if(wave[1]()){
                this.repeat++;
                for(let i1 = 3; i1 < wave.length; i1++){
                    wave[i1].spawn();
                    if(typeof(wave[i1]) == 'number'){
                        await wait(wave[i1]);
                        continue;
                    }
                }
            }
            if(this.repeat == wave[2]){
                this.stage++;
                this.repeat = 0;
            }
        }

        if(wave[0] == 'repeatDelay'){
            this.spawning = true;
            for(let i2 = 0; i2 < wave[2]; i2++){
                await wait(wave[1])
                for(let i1 = 3; i1 < wave.length; i1++){
                    if(typeof(wave[i1]) == 'number'){
                        await wait(wave[i1]);
                        continue;
                    }
                    wave[i1].spawn();
                }
            }
            this.spawning = false;
            this.stage++;
        }
    }
    waveOver(){
        return this.stage >= this.miniWaves.length - 1 && enemyTracker.enemiesAlive == 0;
    }
}

class WaveTracker{
    constructor(){
        this.waves = [];
        this.waveRunning = false;
        this.waveIndex = null;
        this.loop = null;
    }
    spawnWave(){
        if(this.waveRunning == false){
            this.waveIndex = Math.floor(Math.random()*this.waves.length);
            if(this.waveIndex == this.waves.length){
                this.waveIndex = -1;
            }
            this.waveIndex = 0;
            this.waveRunning = true;
        }
        this.waves[this.waveIndex].spawn();
        if(this.waves[this.waveIndex].waveOver()){
            // this.waveRunning = false;
        }
    }
}

class Upgrade{
    constructor(name,cost,func = function(){}){
        this.name = name;
        this.cost = cost;
        this.func = func;
    }
    buy(){
    }
}

class RogueLikeManager{
    constructor(){
        this.upgrades = [new Upgrade('test1',0)];
        this.presentedUpgrades = [];
    }
    draw(){
        Canvas.fillRect(400,250,300,400,'rgb(175,175,175)',0);
        Canvas.strokeRect(400,250,300,400,'rgb(175,175,175)',0);
        Canvas.fillText(this.presentedUpgrades[0].name,275,75,200,'#000000');
        Canvas.fillRect(800,250,300,400,'rgb(175,175,175)',0);
        Canvas.strokeRect(800,250,300,400,'rgb(175,175,175)',0);
        Canvas.fillText(this.presentedUpgrades[1].name,675,75,200,'#000000');
        Canvas.fillRect(1200,250,300,400,'rgb(175,175,175)',0);
        Canvas.strokeRect(1200,250,300,400,'rgb(175,175,175)',0);
        Canvas.fillText(this.presentedUpgrades[2].name,1075,75,200,'#000000');
    }
    spawnUpgrades(){
        this.presentedUpgrades = [];
        for(let i = 0; i < 3; i++){
            let f = Math.floor(Math.random()*this.upgrades.length-0.001);
            // f = 0;
            this.presentedUpgrades.push(this.upgrades[f])
        }
    }
}

const keysDown = new Set();
const mouse = new Mouse();
const bulletTracker = new BulletTracker();
const enemyTracker = new EnemyTracker();
const player = new Player(new Position(800,450),new Size(50,50),10);
const waveTracker = new WaveTracker();
const rogueLikeManager = new RogueLikeManager();


document.addEventListener('keydown',(event)=>{
    keysDown.add(event.key);
	if(event.key == 'e'){
		for(let i = 0; i < enemyTracker.enemiesList.length; i++){
            enemyTracker.enemiesList[i].health = -1;
        }
	}
});

document.addEventListener('keyup',(event)=>{
    keysDown.delete(event.key);
});

document.addEventListener('mousemove',(event)=>{
    mouse.position.x = event.offsetX/window.innerWidth*1600;
    mouse.position.y = event.offsetY/window.innerHeight*900;
});

document.addEventListener('mousedown',(event)=>{
    mouse.down = true;
});

document.addEventListener('mouseup',(event)=>{
    mouse.down = false;
});