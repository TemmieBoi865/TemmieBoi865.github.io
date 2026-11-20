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
    constructor(position,size,speed,img,health,cash){
        super(position,size,speed,img,health,cash);
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

class Looper extends WaveEnemy{
    constructor(position,size,speed,img,health,cash,shoot=true){
        super(position,size,speed,img,health,cash);
        this.startBehavior = function(){};
        this.behavior = function(){
            this.velocity.x = this.speed*Math.sin(this.time/(4*this.speed));
            this.velocity.y = this.speed*Math.cos(this.time/(2*this.speed));
            if(this.time%200 == 0 && shoot){
                new Bullet(new Position(this.position.x,this.position.y),20,new Size(50,5),getAngle(this,player),'enemy');
            }
            border.call(this);
        };
    }
    spawn(){
        super.spawn();
    }
}

class Faller extends WaveEnemy{
    constructor(position,size,speed,img,health,cash,direction,initVelocity,shoot=false){
        super(position,size,speed,img,health,cash);
        this.counts = false;
        this.startBehavior = function(){
            this.velocity.y = initVelocity.y;
            this.velocity.x = initVelocity.x;
        };
        this.behavior = function(){            
            if(direction == 'down'){
                this.velocity.y += this.speed;
            }
            if(direction == 'up'){
                this.velocity.y -= this.speed;
            }
        };
    }
    spawn(){
        super.spawn();
    }
}

class Slinger extends WaveEnemy{
    constructor(position,size,speed,img,health,cash){
        super(position,size,speed,img,health,cash);
        this.startBehavior = function(){};
        this.behavior = function(){
            if(this.position.x > player.position.x){
                this.velocity.x -= this.speed;
            }else{
                this.velocity.x += this.speed;
            }
            if(this.position.y > player.position.y){
                this.velocity.y -= this.speed;
            }else{
                this.velocity.y += this.speed;
            }

            border.call(this);
        };
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
        'repeatDelayContinue',
        10,
        20,
        new Looper(new Position(400,0),new Size(50,50),10,null,5,1,true),
        10,
        new Looper(new Position(400,0),new Size(50,50),10,null,5,1,false),
        10,
        new Looper(new Position(400,0),new Size(50,50),10,null,5,1,false),
        10,
        new Looper(new Position(400,0),new Size(50,50),10,null,5,1,false),
        10,
        new Looper(new Position(400,0),new Size(50,50),10,null,5,1,false),
    ],
    [
        'repeatDelayContinue',
        3000,
        9999,
        new Faller(new Position(1600,900),new Size(50,50),0.5,null,5,1,'down',new Vector(-15,-25),false),
        new Faller(new Position(0,900),new Size(50,50),0.5,null,5,1,'down',new Vector(15,-25),false)
    ],
    [
        'delay',
        2000
    ],
    [
        'conditional',
        function(){return enemyTracker.enemiesAlive <= 90}
    ],
    [
        'repeatDelayContinue',
        250,
        5,
        new Slinger(new Position(800,0),new Size(25,25),0.2,null,3,1)
    ],
    [
        'conditional',
        function(){return enemyTracker.enemiesAlive <= 75}
    ],
    [
        'repeatDelayContinue',
        2000,
        1000,
        new Faller(new Position(400,0),new Size(50,50),0.5,null,200,50,'down',new Vector(0,0),false),
        100,
        new Faller(new Position(800,0),new Size(50,50),0.5,null,200,50,'down',new Vector(0,0),false),
        100,
        new Faller(new Position(1200,0),new Size(50,50),0.5,null,200,50,'down',new Vector(0,0),false)
    ],
    [
        'conditional',
        function(){return enemyTracker.enemiesAlive <= 50}
    ],
    [
        'repeatDelayContinue',
        2000,
        1000,
        new Faller(new Position(320,900),new Size(50,50),0.5,null,200,50,'down',new Vector(0,-20),false),
        100,
        new Faller(new Position(640,900),new Size(50,50),0.5,null,200,50,'down',new Vector(0,-20),false),
        100,
        new Faller(new Position(960,900),new Size(50,50),0.5,null,200,50,'down',new Vector(0,-20),false),
        100,
        new Faller(new Position(1280,900),new Size(50,50),0.5,null,200,50,'down',new Vector(0,-20),false),
    ],
)
