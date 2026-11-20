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
    constructor(position,size,health,speed,cash,img){
        super(position,size,speed,health,cash,img);
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
    constructor(position,size,health,speed,cash,img){
        super(position,size,speed,health,cash,img);
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
    constructor(position,size,health,speed,cash,img){
        super(position,size,speed,health,cash,img);
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
    constructor(position,size,health,speed,cash,img,shoot = true){
        super(position,size,speed,health,cash,img);
        this.startBehavior = function(){};
        this.behavior = function(){
            this.velocity.x = this.speed * Math.sin(toRad(this.time));
            this.velocity.y = this.speed * Math.cos(toRad(this.time*2));

            if(this.time % 200 == 0 && shoot == true){
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
    constructor(position,size,health,speed,cash,img,direction,initialVelocity){
        super(position,size,speed,health,cash,img);
        this.startBehavior = function(){
            this.velocity.x = initialVelocity.x;
            this.velocity.y = initialVelocity.y;
        };
        this.behavior = function(){
            if(direction == 'DL'){
                this.velocity.x = -this.speed;
                this.velocity.y += this.speed/100
            }
            if(direction == 'DR'){
                this.velocity.x = this.speed;
                this.velocity.y += this.speed/100
            }
            if(direction == 'UL'){
                this.velocity.y = -this.speed;
                this.velocity.x += this.speed/100
            }
            if(direction == 'UR'){
                this.velocity.y = this.speed;
                this.velocity.x += this.speed/100
            }
        }
    }
    spawn(){
        super.spawn();
    }
}

class FallingHazard extends WaveEnemy{
    constructor(position,size,health,speed,cash,img,direction,initialVelocity){
        super(position,size,speed,health,cash,img);
        this.startBehavior = function(){
            this.velocity.x = initialVelocity.x;
            this.velocity.y = initialVelocity.y;
        };
        this.behavior = function(){
            this.velocity.y += this.speed/100
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
        25,
        new Looper(new Position(200,0),new Size(50,50),10,10,1,null,true),
        // 10,
        // new Looper(new Position(200,0),new Size(50,50),5,10,1,null,false),
        // 10,
        // new Looper(new Position(200,0),new Size(50,50),5,10,1,null,false),
        // 10,
        // new Looper(new Position(200,0),new Size(50,50),5,10,1,null,false),
    ]
)
