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
        warningTracker.drawAll();
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
    constructor(position,size,speed,img,health,cash,counts=true){
        super(position,size,speed,img,health,cash);
        this.counts = counts;
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

class Swinger extends WaveEnemy{
    constructor(position,size,speed,img,health,cash,direction,initVelocity,counts=true){
        super(position,size,speed,img,health,cash);
        this.counts = counts;
        this.startBehavior = function(){
            this.velocity.y = initVelocity.y;
            this.velocity.x = initVelocity.x;
        };
        this.behavior = function(){            
            if(direction == 'x'){
                this.velocity.x = this.speed * Math.sin(this.time/this.speed);
            }
            if(direction == 'y'){
                this.velocity.y = this.speed * Math.sin(this.time/this.speed);
            }
        };
    }
    spawn(){
        super.spawn();
    }
}

class Looper extends WaveEnemy{
    constructor(position,size,speed,img,health,cash,counts=true,shoot=true){
        super(position,size,speed,img,health,cash);
        this.counts = counts;
        this.startBehavior = function(){};
        this.behavior = function(){
            this.velocity.x = this.speed*Math.sin(this.time/(4*this.speed));
            this.velocity.y = this.speed*Math.cos(this.time/(2*this.speed));
            if(this.time%200 == 0 && shoot){
                new Bullet(new Position(this.position.x,this.position.y),10,new Size(50,5),getAngle(this,player),'enemy');
            }
            border.call(this);
        };
    }
    spawn(){
        super.spawn();
    }
}

class Faller extends WaveEnemy{
    constructor(position,size,speed,img,health,cash,direction,initVelocity,counts=false){
        super(position,size,speed,img,health,cash);
        this.counts = counts;
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
    constructor(position,size,speed,img,health,cash,counts=true){
        super(position,size,speed,img,health,cash);
        this.counts = counts;
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

// wave 1
{
new Wave(
    [
        'repeatDelayContinue',
        1000,
        6,
        new Slinger(new Position(800,0),new Size(40,40),0.2,null,2,1)
    ],
    [
        'repeatDelay',
        100,
        5,
        new Faller(new Position(0,0),new Size(50,50),0.2,null,25,10,'down',new Vector(10,0),false),
        new Faller(new Position(1600,0),new Size(50,50),0.2,null,25,10,'down',new Vector(-10,0),false)
    ],
    [
        'repeatDelayContinue',
        10,
        10,
        new Looper(new Position(1600,0),new Size(50,50),10,null,1,1,true,true),
        new Looper(new Position(0,0),new Size(50,50),10,null,1,1,true,true)
    ],
    [
        'delay',
        5000,
    ],
    [
        'conditional',
        function(){return enemyTracker.enemiesAlive <= 20}
    ],
    [
        'repeatDelayContinue',
        2000,
        5,
        new Faller(new Position(400,900),new Size(50,50),0.2,null,50,25,'down',new Vector(0,-15)),
        50,
        new Faller(new Position(800,900),new Size(50,50),0.2,null,50,25,'down',new Vector(0,-15)),
        50,
        new Faller(new Position(1200,900),new Size(50,50),0.2,null,50,25,'down',new Vector(0,-15)),
    ]
)
}

// wave 2
{
    new Wave(
        [
            'repeatDelayContinue',
            200,
            10,
            new Swinger(new Position(800,0),new Size(50,50),10,null,5,1,'x',new Vector(0,10),true),
            new Swinger(new Position(400,0),new Size(50,50),10,null,5,1,'x',new Vector(0,10),true),
            new Swinger(new Position(1200,0),new Size(50,50),10,null,5,1,'x',new Vector(0,10),true)
        ],
        [
            'repeatDelayContinue',
            200,
            10,
            new Swinger(new Position(800,900),new Size(50,50),10,null,5,1,'x',new Vector(0,-10),true),
            new Swinger(new Position(400,900),new Size(50,50),10,null,5,1,'x',new Vector(0,-10),true),
            new Swinger(new Position(1200,900),new Size(50,50),10,null,5,1,'x',new Vector(0,-10),true)
        ],
        [
            'repeatDelayContinue',
            1000,
            2,
            new BasicEnemy(new Position(0,450),new Size(100,100),2,null,15,5)
        ],
        [
            'delay',
            500
        ],
        [
            'repeatDelay',
            1000,
            2,
            new BasicEnemy(new Position(1600,450),new Size(100,100),2,null,15,5)
        ],
        [
            'conditional',
            () => enemyTracker.enemiesAlive <= 4
        ],
        [
            'repeatDelay',
            1000,
            5,
            new Swinger(new Position(800,0),new Size(50,50),10,null,5,1,'x',new Vector(0,5),true),
            new Swinger(new Position(400,0),new Size(50,50),10,null,5,1,'x',new Vector(0,5),true),
            new Swinger(new Position(1200,0),new Size(50,50),10,null,5,1,'x',new Vector(0,5),true)
        ]
    )
}

// new Wave(
//     [
//         'delay',
//         100,
//         new BasicEnemy(new Position(800,450),new Size(50,50),0,null,10000,1)
//     ]
// )

//boss 1
{
new BossWave(
    [
        'delay',
        1000,
    ],
    [
        'repeatDelayContinue',
        10,
        20,
        new Looper(new Position(400,0),new Size(50,50),10,null,5,1,true,true),
        10,
        new Looper(new Position(400,0),new Size(50,50),10,null,5,1,true,false),
        10,
        new Looper(new Position(400,0),new Size(50,50),10,null,5,1,true,false),
        10,
        new Looper(new Position(400,0),new Size(50,50),10,null,5,1,true,false),
        10,
        new Looper(new Position(400,0),new Size(50,50),10,null,5,1,true,false),
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
        function(){return enemyTracker.enemiesAlive <= 75}
    ],
    [
        'repeatDelayContinue',
        2000,
        1000,
        new Faller(new Position(0,0),new Size(50,50),0.5,null,200,50,'down',new Vector(0,0),false),
        100,
        new Faller(new Position(400,0),new Size(50,50),0.5,null,200,50,'down',new Vector(0,0),false),
        100,
        new Faller(new Position(800,0),new Size(50,50),0.5,null,200,50,'down',new Vector(0,0),false),
        100,
        new Faller(new Position(1200,0),new Size(50,50),0.5,null,200,50,'down',new Vector(0,0),false),
        100,
        new Faller(new Position(1600,0),new Size(50,50),0.5,null,200,50,'down',new Vector(0,0),false)
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
}
