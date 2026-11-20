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

new Wave(
[
    'delay',
    1000,
],
[
    'repeatDelay',
    10,
    250,
    new WaveEnemy(new Position(800,0),new Size(50,50),10,null,200,1,'fall down','cos x','no borders','shoot omni'),
],
[
    'repeatDelay',
    10,
    250,
    new WaveEnemy(new Position(400,0),new Size(50,50),10,null,200,1,'fall down','cos x','no borders','shoot omni'),
    new WaveEnemy(new Position(1200,0),new Size(50,50),10,null,200,1,'fall down','cos x','no borders','shoot omni'),
],
[
    'repeatDelay',
    10,
    250,
    new WaveEnemy(new Position(0,300),new Size(50,50),10,null,200,1,'fall right','sin y','no borders','shoot omni'),
    new WaveEnemy(new Position(0,600),new Size(50,50),10,null,200,1,'fall right','sin y','no borders','shoot omni'),
],
[
    'repeatDelay',
    10,
    250,
    new WaveEnemy(new Position(1600,300),new Size(50,50),10,null,200,1,'fall left','sin y','no borders','shoot omni'),
    new WaveEnemy(new Position(1600,600),new Size(50,50),10,null,200,1,'fall left','sin y','no borders','shoot omni'),
],
[
    'conditional',
    function(){return enemyTracker.enemiesAlive == 0}
],
[
    'repeatDelay',
    50,
    20,
    new WaveEnemy(new Position(800,0),new Size(25,25),20,null,3,1,'cos x','shoot player')
],
[
    'repeatDelay',
    25,
    50,
    new WaveEnemy(new Position(800,25),new Size(25,25),20,null,1,0,'cos x')
],
[
    'conditional',
    function(){return enemyTracker.enemiesAlive == 0}
],
[
    'repeatDelay',
    250,
    10,
    new WaveEnemy(new Position(1600,900),new Size(50,50),10,null,5,1,'DR loop'),
    new WaveEnemy(new Position(0,900),new Size(50,50),10,null,5,1,'DL loop')
],
[
    'repeatDelay',
    100,
    10,
    new WaveEnemy(new Position(1600,0),new Size(50,50),15,null,5,1,'move left','fall down','no borders')
],
[
    'repeatDelay',
    100,
    10,
    new WaveEnemy(new Position(0,0),new Size(50,50),15,null,5,1,'move right','fall down','no borders')
],
[
    'repeatDelay',
    100,
    10,
    new WaveEnemy(new Position(1600,900),new Size(50,50),15,null,5,1,'move left','fall up','no borders')
],
[
    'repeatDelay',
    100,
    10,
    new WaveEnemy(new Position(0,900),new Size(50,50),15,null,5,1,'move right','fall up','no borders')
],
[
    'repeatDelay',
    250,
    5,
    new WaveEnemy(new Position(800,0),new Size(25,25),0.2,null,2,1,'slinger')
],
[
    'conditional',
    function(){return enemyTracker.enemiesAlive == 0}
],
[
    'repeatDelay',
    10,
    100,
    new WaveEnemy(new Position(800,0),new Size(25,25),10,null,1,0.5,'UL loop','shoot player')
]
);

new Wave(
[
    'repeatDelay',
    125,
    3,
    new WaveEnemy(new Position(1600,0),new Size(50,50),10,null,5,'DL curve','no borders','shoot down'),
    new WaveEnemy(new Position(1600,0),new Size(50,50),5,null,5,'DL curve','no borders','shoot down'),
    new WaveEnemy(new Position(1600,0),new Size(50,50),15,null,5,'DL curve','no borders','shoot down')
],
[
    'delay',
    250
],
[
    'repeatDelay',
    125,
    3,
    new WaveEnemy(new Position(0,0),new Size(50,50),5,null,5,'DR curve','no borders','shoot down'),
    new WaveEnemy(new Position(0,0),new Size(50,50),10,null,5,'DR curve','no borders','shoot down'),
    new WaveEnemy(new Position(0,0),new Size(50,50),15,null,5,'DR curve','no borders','shoot down')
],
[
    'conditional',
    function(){return enemyTracker.enemiesAlive == 0}
],
[
    'repeatDelay',
    250,
    3,
    new WaveEnemy(new Position(1600,900),new Size(50,50),10,null,10,'DR loop')
],
[
    'repeatDelay',
    250,
    3,
    new WaveEnemy(new Position(0,900),new Size(50,50),10,null,10,'DL loop')
],
[
    'repeatDelay',
    500,
    5,
    new WaveEnemy(new Position(800,0),new Size(25,25),0.06,null,2,'slinger')
],
[
    'conditional',
    function(){return enemyTracker.enemiesAlive <= 10}
],
[
    'repeatDelay',
    125,
    3,
    new WaveEnemy(new Position(0,0),new Size(50,50),0.2,null,2,'line move','reverse accelerate')
],
[
    'conditional',
    function(){return enemyTracker.enemiesAlive <= 2}
],
[
    'delay',
    2000,
    new WaveEnemy(new Position(0,0),new Size(50,50),0.1,null,5,'slinger'),
    100,
    new WaveEnemy(new Position(320,0),new Size(50,50),0.1,null,5,'slinger'),
    100,
    new WaveEnemy(new Position(640,0),new Size(50,50),0.1,null,5,'slinger'),
    100,
    new WaveEnemy(new Position(960,0),new Size(50,50),0.1,null,5,'slinger'),
    100,
    new WaveEnemy(new Position(1280,0),new Size(50,50),0.1,null,5,'slinger'),
    100,
    new WaveEnemy(new Position(1600,0),new Size(50,50),0.1,null,5,'slinger'),
    100,
],
[
    'conditional',
    function(){return enemyTracker.enemiesAlive <= 5}
],
[
    'repeatDelay',
    200,
    5,
    new WaveEnemy(new Position(1600,0),new Size(25,25),5,null,5,'DL curve','no borders','shoot1'),
    new WaveEnemy(new Position(1600,0),new Size(25,25),10,null,5,'DL curve','no borders','shoot1'),
    new WaveEnemy(new Position(1600,0),new Size(25,25),15,null,5,'DL curve','no borders','shoot1')
],
[
    'conditional',
    function(){return enemyTracker.enemiesAlive <= 1}
],
[
    'repeatDelay',
    250,
    5,
    new WaveEnemy(new Position(700,100),new Size(50,50),10,null,25,'shoot omni','sin x')
],
[
    'conditional',
    function(){return enemyTracker.enemiesAlive <= 0}
],
[
    'repeatDelay',
    20,
    25,
    new WaveEnemy(new Position(200,0),new Size(50,50),10,null,1,'UL loop','shoot1')
],
[
    'repeatDelay',
    100,
    10,
    // new WaveEnemy(new Position(1600,0),new Size(25,25),5,null,5,'DL curve','no borders','shoot omni'),
    new WaveEnemy(new Position(1600,0),new Size(25,25),15,null,5,'DL curve','no borders','shoot omni')
],
[
    'delay',
    2000
],
[
    'repeatDelay',
    100,
    10,
    // new WaveEnemy(new Position(0,0),new Size(25,25),5,null,5,'DR curve','no borders','shoot omni'),
    new WaveEnemy(new Position(0,0),new Size(25,25),15,null,5,'DR curve','no borders','shoot omni')
],
[
    'delay',
    2000
],
[
    'repeatDelay',
    250,
    5,
    new WaveEnemy(new Position(1600,0),new Size(25,25),0.1,null,3,'slinger','shoot omni')
],
[
    'conditional',
    function(){return enemyTracker.enemiesAlive == 0}
],
[
    'repeatDelay',
    10,
    50,
    new WaveEnemy(new Position(800,0),new Size(50,50),10,null,5,'cos x','move down','no borders')
]
)
