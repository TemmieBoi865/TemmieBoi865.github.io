function drawGameScreen(){
    if(player.menu == false){
        playerMovement(player);
        enemyTracker.simulateAll();
        player.rotation = getAngle(player,mouse);
        if(mouse.down || keysDown.has(' ')){
            player.fireShot();
        }
        bulletTracker.simulateAll();
    }
    
    // Canvas.ctx.fillText(bulletTracker.bullets,200,200)
    
    bulletTracker.drawAll();
    enemyTracker.drawAll();
    player.move();
    player.draw();
    drawUI();
}

async function start(){
    // rogueLikeManager.spawnUpgrades();
    setInterval(function(){
        Canvas.clear();
        if(rogueLikeManager.shop == true){
            rogueLikeManager.draw();
        }
        drawGameScreen();
    },16.6);
    setInterval(function(){
        if(rogueLikeManager.shop == false && player.menu == false){
            waveTracker.spawnWave();
        }
    },100);
}

function border(){
    if(this.position.x - this.size.w/2 < 0){
        this.position.x = this.size.w/2;
        this.velocity.x = 0;
    }
    else if(this.position.x + this.size.w/2 > 1600){
        this.position.x = 1600 - this.size.w/2;
        this.velocity.x = 0;
    }
    if(this.position.y - this.size.h/2 < 0){
        this.position.y = this.size.h/2;
        this.velocity.y = 0;
    }
    else if(this.position.y + this.size.h/2 > 900){
        this.position.y = 900 - this.size.h/2;
        this.velocity.y = 0;
    }
}

class BasicEnemy extends WaveEnemy{
    constructor(position,size){
        super(position,size);
        this.speed = 5;
        this.img = null;
        this.health = 5;
        this.cash = 1;
        this.startBehavior = function(){};
        this.behavior = function(){
            this.velocity.normalize(this.speed,getAngle(this,player));
            border.call(this);
        };
    }
    spawn(){
        super.spawn();
    }
}

class Slinger extends WaveEnemy{
    constructor(position,size){
        super(position,size);
        this.speed = 0.1;
        this.img = null;
        this.health = 3;
        this.cash = 1;
        this.startBehavior = function(){};
        this.behavior = function(){
            if(player.position.x > this.position.x){
                this.velocity.x += this.speed;
            }
            else if(player.position.x < this.position.x){
                this.velocity.x -= this.speed;
            }
            if(player.position.y > this.position.y){
                this.velocity.y += this.speed;
            }
            else if(player.position.y < this.position.y){
                this.velocity.y -= this.speed;
            }

            border.call(this);

        };
    }
    spawn(){
        super.spawn();
    }
}

class Ranger extends WaveEnemy{
    constructor(position,size){
        super(position,size);
        this.speed = 0.1;
        this.img = null;
        this.health = 3;
        this.cash = 1;
        this.startBehavior = function(){};
        this.behavior = function(){
            if(player.position.x > this.position.x){
                this.velocity.x += this.speed;
            }
            else if(player.position.x < this.position.x){
                this.velocity.x -= this.speed;
            }
            if(player.position.y > this.position.y){
                this.velocity.y += this.speed;
            }
            else if(player.position.y < this.position.y){
                this.velocity.y -= this.speed;
            }

            if(this.time % 50 == 0){
                new Bullet(new Position(this.position.x,this.position.y),20,new Size(50,5),getAngle(this,player),'enemy');
            }

            border.call(this);
        }
    }
    spawn(){
        super.spawn();
    }
}

class Looper extends WaveEnemy{
    constructor(position,size){
        super(position,size);
        this.speed = 10;
        this.img = null;
        this.health = 3;
        this.cash = 1;
        this.startBehavior = function(){};
        this.behavior = function(){
            this.velocity.x = this.speed * Math.sin(toRad(this.time));
            this.velocity.y = this.speed * Math.cos(toRad(this.time*2));

            if(this.time % 100 == 0){
                new Bullet(new Position(this.position.x,this.position.y),20,new Size(50,5),getAngle(this,player),'enemy');
            }

            border.call(this);
        }
    }
    spawn(){
        super.spawn();
    }
}

class Faller extends WaveEnemy{
    constructor(position,size,direction){
        super(position,size);
        this.speed = 10;
        this.img = null;
        this.health = 3;
        this.cash = 1;
        this.startBehavior = function(){
        };
        this.behavior = function(){
            if(direction == 'DL'){
                this.velocity.x = -this.speed;
                this.velocity.y += this.speed/100
            }
        }
    }
    spawn(){
        super.spawn();
    }
}


new Wave(
    [
        'delay',
        1000,
    ],
    [
        'repeatDelay',
        10,
        100,
        new Looper(new Position(200,0),new Size(50,50))
    ],
    [
        'conditional',
        function(){return enemyTracker.enemiesAlive <= 100}
    ],
    [
        'repeatDelay',
        250,
        10,
        new Faller(new Position(1600,0),new Size(50,50),'DL',new Vector(0,0))
    ]
)
