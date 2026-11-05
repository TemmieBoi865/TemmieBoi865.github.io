class CanvasCreator{
    constructor(){
        this.ctx = document.getElementById('canvas').getContext('2d');
        this.rotation = 0;
        this.xPos = 0;
        this.yPos = 0;
    }
    setRotation(angle){
        let ang = angle - this.rotation
        this.ctx.rotate(ang);
        this.rotation = angle;
    }
    fillRect(x,y,w,h,r=0){
        if(r == 0){
            this.ctx.fillRect(x-w/2,y-h/2,w,h);
        }
        else{
            this.ctx.rotate(toRad(-r));
            let rot = Math.atan(x/y)*180/Math.PI;
            let dis = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
            this.ctx.fillRect(dis*(Math.sin(toRad(-r+rot)))-w/2,dis*(Math.cos(toRad(-r+rot)))-h/2,w,h);
            this.ctx.rotate(toRad(r));
        }
    }
    fillCircle(x,y,r){
        this.ctx.beginPath();
        this.ctx.arc(x,y,r,0,2*Math.PI);
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    drawImage(src,x,y,w,h,r=0){
        this.ctx.rotate(toRad(-r));
        let rot = Math.atan(x/y)*180/Math.PI;
        let dis = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
        this.ctx.drawImage(src,dis*(Math.sin(toRad(-r+rot)))-w/2,dis*(Math.cos(toRad(-r+rot)))-h/2,w,h);
        this.ctx.rotate(toRad(r));
    }
}

class GameObjectManager{
    constructor(){
        this.objects = [];
    }
    getObjectById(id,returnType = 'obj'){
        for(let i = 0; i < this.objects.length; i++){
            if(this.objects[i].id == id){
                if(returnType == 'obj'){
                    return this.objects[i];
                }
                if(returnType == 'index'){
                    return i;
                }
            }
        }
    }
    addObject(obj){
        this.objects.push(obj)
    }
    setObject(id,obj){
        this.objects[this.getObjectById(id,'index')] = obj;
    }
    drawAll(){
        for(let i = 0; i < this.objects.length; i++){
            this.objects[i].draw();
        }
    }
    simulateAll(){
        for(let i = 0; i < this.objects.length; i++){
            if(this.objects[i].simulate == true){
                this.objects[i].simPhy();
            }
        }
    }
}

const Objects = new GameObjectManager();
const Canvas = new CanvasCreator();
const elm = (id) => document.getElementById(id);
const toRad = (degree) => degree*Math.PI/180;
const toDeg = (radian) => radian*180/Math.PI;

class Vector2{
    constructor(xVel,yVel,rotVel){
        this.xVel = xVel;
        this.yVel = yVel;
        this.rotVel = rotVel;
    }
    normalize(velocity,angle){
        this.xVel = velocity*toDeg(Math.cos(toRad(angle)));
        this.yVel = velocity*toDeg(Math.sin(toRad(angle)));
    }
}

class GameObject{
    constructor(id,xPos=0,yPos=0,width=0,height=0){
        this.simulate = false;
        this.gravity = false;
        this.rotationVel = 0;
        this.vector = new Vector2(0,0);
        this.shape = 'rect';

        this.id = id;
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;
        this.rotation = 0;
        Objects.addObject(this);
    }
    updateObj(){
        Objects.setObject(this.object,this);
    }
    changeShape(shape){
        if(shape == 'rect'){
            this.shape = 'rect';
        }
        if(shape == 'circle'){
            this.shape = 'circle'
        }
        this.updateObj();
    }
    setSize(w,h){
        this.width = w;
        this.height = h;
        this.updateObj();
    }
    setPosition(x,y){
        this.xPos = x;
        this.yPos = y;
        this.updateObj();
    }
    setRotation(angle){
        this.rotation = angle%360;
        this.updateObj();
    }
    addImage(src){
        this.img = src;
        this.updateObj();
    }
    draw(){
        if(this.img == undefined){
            if(this.shape == 'rect'){
                Canvas.fillRect(this.xPos,this.yPos,this.width,this.height,this.rotation);
            }
            if(this.shape == 'circle'){
                Canvas.fillCircle(this.xPos,this.yPos,(this.width+this.height)/4);
            }
        }
        else if(this.img != undefined){
            Canvas.drawImage(this.img,this.xPos,this.yPos,this.width,this.height,this.rotation);
        }
    }
    setVector(vector2){
        this.simulate = true;
        this.vector = vector2;
        this.updateObj();
    }
    addVector(vector2){
        this.vector.xVel += vector2.xVel;
        this.vector.yVel += vector2.yVel;
        this.updateObj();
    }
    setRotationVelocity(speed){
        this.rotationVel = speed;
    }
    simPhy(){
        if(this.gravity == true){
            this.vector.yVel++;
        }
        this.xPos += this.vector.xVel;
        this.yPos += this.vector.yVel;
        this.rotation += this.rotationVel;
        this.updateObj();
    }
    addGravity(){
        this.gravity = true;
    }
}

