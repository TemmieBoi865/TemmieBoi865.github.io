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

    if(player.menu == true){
        Canvas.fillRect(800,450,1400,700,'rgb(100,100,100)');
        Canvas.fillText('Game',750,150,100,'#000000');
        Canvas.fillText('Player Stats',150,200,500,'#000000');
        Canvas.fillText('Speed: '+player.speed,150,250,500,'#000000');
        Canvas.fillText('Damage: '+player.damage,150,275,500,'#000000');
        Canvas.fillText('Shot CD: '+player.shotCD,150,300,500,'#000000');
        Canvas.fillText('Bullet Spread: '+player.spread,150,325,500,'#000000');
    }
}

function onClick(){
    if(rogueLikeManager.shop == true){
        rogueLikeManager.checkClick();
    }
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
    getById(id){
        for(let i = 0; i < this.enemiesList.length; i++){
            if(this.enemiesList[i].id == id){
                return this.enemiesList[i];
            }
        }
        return null;
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
    constructor(position,size,speed,img,health,cash,startBehavior,behavior){
        this.id = enemyTracker.ids;
        enemyTracker.ids++;
        this.position = position;
        this.index = enemyTracker.enemiesList.length;
        this.size = size;
        this.speed = speed;
        this.velocity = new Vector();
        this.img = img;
        this.health = health;
        this.cash = cash;
        this.startBehavior = startBehavior;
        this.time = 0;
        this.alive = true;
        this.behavior = behavior;
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
                        this.health-=player.damage;
                        if(this.health <= 0){
                            player.money+=this.cash;
                        }
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
            if(this.img != null){
                Canvas.drawImage(this.img,this.position.x,this.position.y,this.size.w,this.size.h);
            } else {
                Canvas.fillRect(this.position.x,this.position.y,this.size.w,this.size.h,'#000000',0);
            }
        }
    }
    move(){
        if(this.alive){
            if(this.time == 0){
                this.startBehavior();
            }
            this.time++;
            
            this.behavior();

            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            if(this.position.x - this.size.w/2 < -100 || this.position.x + this.size.w/2 > 1700 || this.position.y - this.size.h/2 < -100 || this.position.y + this.size.h/2 > 1000){
                this.delete();
            }
        }
    }
    delete(){
        for(let i = 0; i < enemyTracker.enemiesList.length; i++){
            if(this.id == enemyTracker.enemiesList[i].id){
                try{
                    // player.money++;
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
    constructor(position,size,speed,img,health,cash,startBehavior,behavior){
        this.position = position;
        this.size = size;
        this.speed = speed;
        this.img = img;
        this.health = health;
        this.cash = cash
        this.startBehavior = startBehavior;
        this.behavior = behavior;
        this.alive = true;
    }
    spawn(){
        new Enemy(new Position(this.position.x,this.position.y),new Size(this.size.w,this.size.h),this.speed,this.img,this.health,this.cash,this.startBehavior,this.behavior);
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
        this.spread = 0;
        this.canShoot = true;
        this.damage = 1;

        this.menu = false;

        this.ability = function(){
            player.position.x = mouse.position.x;
            player.position.y = mouse.position.y;
        };
        this.abilityCD = 1000;
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
            new Bullet(new Position(this.position.x,this.position.y),25,new Size(50,5),this.rotation + (Math.random()-0.5)*this.spread,'player');
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
            await wait(this.abilityCD)
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
        if(this.stage >= this.miniWaves.length - 1 && enemyTracker.enemiesAlive == 0){
            this.stage = 0;
            return true;
        }
        return false;
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
            this.waveIndex = Math.floor(Math.random()*this.waves.length-0.001);
            this.waveRunning = true;
            // this.waveIndex = 0;
        }
        if(this.waveRunning == true && rogueLikeManager.shop == false){
            this.waves[this.waveIndex].spawn();
        }
        if(this.waves[this.waveIndex].waveOver() && rogueLikeManager.shop == false){
            this.waveRunning = false;
            rogueLikeManager.shop = true;
            rogueLikeManager.spawnUpgrades();
        }
    }
}

class Upgrade{
    constructor(name,cost,func = function(){},...description){
        this.name = name;
        this.cost = cost;
        this.func = func;
        this.description = description;
    }
    buy(){
    }
}

class RogueLikeManager{
    constructor(){
        this.upgrades = [
            new Upgrade('Speed', 10, function(){player.speed += 1},'Increases Speed By 1'),
            new Upgrade('Spray Gun',20,function(){player.shotCD -= 10; player.spread += 5},'-10ms Shot CD','+5 Bullet Spread'),
            new Upgrade('Health',5,function(){player.health += 2},'Increases Health by +2'),
            new Upgrade('Damage',20,function(){player.damage += 1},'Increases Damage By 1'),
            new Upgrade('Focus Shot',25,function(){player.damage += 1; player.spread -= 10; if(player.spread < 0){player.spread = 0} player.shotCD += 5},'More Damage, Less Spread','Longer Shot CD')
        ];
        this.presentedUpgrades = [];
        this.shop = false;
        this.priceMult = 1;
    }
    buy(i){
        if(player.money >= Math.round(this.presentedUpgrades[i].cost*this.priceMult)){
            player.money -= Math.round(this.presentedUpgrades[i].cost*this.priceMult);
            this.presentedUpgrades[i].func();
            this.rerollUgrade(i);
            this.priceMult += 0.2;
        }
    }
    leaveShop(){
        this.shop = false;
    }
    checkClick(){
        for(let i = 0; i < 3; i++){
            if(mouse.position.x >= 250+400*i && mouse.position.x <= 550+400*i && mouse.position.y >= 100 && mouse.position.y <= 400){
                this.buy(i);
            }
        }
        if(mouse.position.x >= 1425 && mouse.position.x <= 1575 && mouse.position.y >= 825 && mouse.position.y <= 875){
            this.leaveShop();
        }
        if(mouse.position.x >= 25 && mouse.position.x <= 175 && mouse.position.y >= 825 && mouse.position.y <= 875){
            if(player.money >= 2){
                this.spawnUpgrades();
                player.money -= 2;
            }
        }
    }
    draw(){
        Canvas.fillRect(400,250,300,400,'rgb(175,175,175)',0);
        Canvas.strokeRect(400,250,300,400,'#000000',0);
        Canvas.fillText(this.presentedUpgrades[0].name,275,75,200,'#000000');
        Canvas.fillText(Math.round(this.presentedUpgrades[0].cost*this.priceMult) + '$',275,100,200,'#000000');
        for(let i = 0; i < this.presentedUpgrades[0].description.length; i++){
            Canvas.fillText(this.presentedUpgrades[0].description[i],275,150+30*i,200,'#000000');
        }

        Canvas.fillRect(800,250,300,400,'rgb(175,175,175)',0);
        Canvas.strokeRect(800,250,300,400,'#000000',0);
        Canvas.fillText(this.presentedUpgrades[1].name,675,75,200,'#000000');
        Canvas.fillText(Math.round(this.presentedUpgrades[1].cost*this.priceMult) + '$',675,100,200,'#000000');
        for(let i = 0; i < this.presentedUpgrades[1].description.length; i++){
            Canvas.fillText(this.presentedUpgrades[1].description[i],675,150+30*i,200,'#000000');
        }

        Canvas.fillRect(1200,250,300,400,'rgb(175,175,175)',0);
        Canvas.strokeRect(1200,250,300,400,'#000000',0);
        Canvas.fillText(this.presentedUpgrades[2].name,1075,75,200,'#000000');
        Canvas.fillText(Math.round(this.presentedUpgrades[2].cost*this.priceMult) + '$',1075,100,200,'#000000');
        for(let i = 0; i < this.presentedUpgrades[2].description.length; i++){
            Canvas.fillText(this.presentedUpgrades[2].description[i],1075,150+30*i,200,'#000000');
        }

        Canvas.fillRect(1500,850,150,50,'rgb(175,0,0)',0);
        Canvas.strokeRect(1500,850,150,50,'#000000',0);
        Canvas.fillText('Exit', 1475, 855, 350, '#000000');

        Canvas.fillRect(100,850,150,50,'rgb(0,175,0)',0);
        Canvas.strokeRect(100,850,150,50,'#000000',0);
        Canvas.fillText('Reroll -2$', 60, 855, 350, '#000000');
    }
    spawnUpgrades(){
        this.presentedUpgrades = [];
        for(let i = 0; i < 3; i++){
            let f = Math.floor(Math.random()*this.upgrades.length-0.001);
            // f = 0;
            this.presentedUpgrades.push(this.upgrades[f])
        }
    }
    rerollUgrade(index){
        this.presentedUpgrades[index] = this.upgrades[Math.floor(Math.random()*this.upgrades.length-0.001)];
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
    if(event.key == 'Escape'){
        player.menu = !player.menu;
    }
	if(event.key == 'e'){
        if(rogueLikeManager.shop == true){
            rogueLikeManager.leaveShop();
        }
	}
    if(event.key == 'r'){
        if(rogueLikeManager.shop == true && player.money >= 2){
            rogueLikeManager.spawnUpgrades();
            player.money -= 2;
        }
	}
    if(rogueLikeManager.shop == true){
        if(event.key == '1'){
            rogueLikeManager.buy(0);
        }
        if(event.key == '2'){
            rogueLikeManager.buy(1);
        }
        if(event.key == '3'){
            rogueLikeManager.buy(2);
        }
    }
    if(event.key == 'm'){
        player.money += 10000;
    }
    if(event.key == 'g'){
        let e = enemyTracker.enemiesList.length
        for(let i = 0; i < e; i++){
            enemyTracker.enemiesList[0].delete();
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
    mouse.position.x = event.offsetX/window.innerWidth*1600;
    mouse.position.y = event.offsetY/window.innerHeight*900;
    onClick();
});

document.addEventListener('mouseup',(event)=>{
    mouse.down = false;
});
