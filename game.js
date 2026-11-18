function drawGameScreen(){
    playerMovement(player);
    enemyTracker.simulateAll();
    enemyTracker.drawAll();
    player.rotation = getAngle(player,mouse);
    if(mouse.down || keysDown.has(' ')){
        player.fireShot();
    }
    bulletTracker.simulateAll();
    bulletTracker.drawAll();
    // Canvas.ctx.fillText(bulletTracker.bullets,200,200)
    drawUI();
    player.move();
    player.draw();
    bulletTracker.checkAll();
}

async function start(){
    rogueLikeManager.spawnUpgrades();
    setInterval(function(){
        Canvas.clear();
        rogueLikeManager.draw();
        drawGameScreen();
    },16.6);
    setInterval(function(){
        // waveTracker.spawnWave();
    },100);
}

var test = new Wave(
[
    'delay',
    0,
    new WaveEnemy(new Position(800,50),new Size(50,50),0,null,1,'shoot down')
]
)

var wave2 = new Wave(
[
    'repeatDelay',
    125,
    5,
    new WaveEnemy(new Position(0,0),new Size(50,50),10,null,5,'shoot1','UL loop')
],
[
    'conditional',
    function(){return enemyTracker.enemiesAlive == 0}

],
[
    'repeatDelay',
    125,
    5,
    new WaveEnemy(new Position(1600,0),new Size(50,50),10,null,5,'shoot down','UR loop')
]
)

var wave1 = new Wave(
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
    new WaveEnemy(new Position(800,0),new Size(25,25),0.2,null,3,'slinger')
],
[
    'delay',
    5000
],
[
    'repeatDelay',
    125,
    3,
    new WaveEnemy(new Position(0,0),new Size(50,50),0.2,null,5,'line move','reverse accelerate')
],
[
    'conditional',
    function(){return enemyTracker.enemiesAlive == 2}
],
[
    'delay',
    2000,
    new WaveEnemy(new Position(0,0),new Size(50,50),0.2,null,7,'slinger'),
    100,
    new WaveEnemy(new Position(320,0),new Size(50,50),0.2,null,7,'slinger'),
    100,
    new WaveEnemy(new Position(640,0),new Size(50,50),0.2,null,7,'slinger'),
    100,
    new WaveEnemy(new Position(960,0),new Size(50,50),0.2,null,7,'slinger'),
    100,
    new WaveEnemy(new Position(1280,0),new Size(50,50),0.2,null,7,'slinger'),
    100,
    new WaveEnemy(new Position(1600,0),new Size(50,50),0.2,null,7,'slinger'),
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
    'delay',
    2000,
    new WaveEnemy(new Position(100,100),new Size(50,50),0,null,25,'shoot1'),
    new WaveEnemy(new Position(1500,100),new Size(50,50),0,null,25,'shoot1')
],
[
    'delay',
    5000,
],
[
    'repeatDelay',
    250,
    new WaveEnemy(new Position(100,100),new Size(50,50),0,null,25,'shoot omni','sin x')
],
[
    'conditional',
    function(){return enemyTracker.enemiesAlive == 0}
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
    new WaveEnemy(new Position(1600,0),new Size(25,25),5,null,5,'DL curve','no borders','shoot omni'),
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
    new WaveEnemy(new Position(0,0),new Size(25,25),5,null,5,'DR curve','no borders','shoot omni'),
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
    new WaveEnemy(new Position(1600,0),new Size(25,25),0.2,null,3,'slinger','shoot omni')
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