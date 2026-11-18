class CanvasCreator{
    constructor(){
        this.ctx = document.getElementById('canvas').getContext('2d');
        this.rotation = 0;
        this.xPos = 0;
        this.yPos = 0;
    }
    clear(){
        this.ctx.clearRect(0,0,1830,1025);  
    }
    fillPolygon(color = '#000000',...points){
        this.ctx.beginPath();
        this.ctx.fillStyle = color
        for(let i = 0; i < points.length; i++){
            this.ctx.lineTo(points[i].x,points[i].y);
        }
        this.ctx.fill();
        this.ctx.stroke();
    }
    fillRect(x,y,w,h,color,r=0){
        this.ctx.fillStyle = color;
        if(r == 0){
            this.ctx.fillRect(x-w/2,y-h/2,w,h);
        }
        else if(x > -10 && y > -10){
            this.ctx.rotate(toRad(r));
            let rot = Math.atan(x/y)*180/Math.PI;
            let dis = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
            this.ctx.fillRect(dis*(Math.sin(toRad(r+rot)))-w/2,dis*(Math.cos(toRad(r+rot)))-h/2,w,h);
            this.ctx.rotate(toRad(-r));
        }
    }
    strokeRect(x,y,w,h,color,r=0){
        this.ctx.fillStyle = color;
        if(r == 0){
            this.ctx.strokeRect(x-w/2,y-h/2,w,h);
        }
        else if(x > -10 && y > -10){
            this.ctx.rotate(toRad(r));
            let rot = Math.atan(x/y)*180/Math.PI;
            let dis = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
            this.ctx.strokeRect(dis*(Math.sin(toRad(r+rot)))-w/2,dis*(Math.cos(toRad(r+rot)))-h/2,w,h);
            this.ctx.rotate(toRad(-r));
        }
    }
    fillText(text,x,y,maxw,color,r=0){
        this.ctx.fillStyle = color;
        if(r == 0){
            this.ctx.fillText(text,x,y,maxw);
        }
        else if(x > -10 && y > -10){
            this.ctx.rotate(toRad(r));
            let rot = Math.atan(x/y)*180/Math.PI;
            let dis = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
            this.ctx.fillText(text,dis*(Math.sin(toRad(r+rot))),dis*(Math.cos(toRad(r+rot))),maxw);
            this.ctx.rotate(toRad(-r));
        }
    }
    fillCircle(x,y,r,color){
        this.ctx.beginPath();
        this.ctx.fillStyle = color
        this.ctx.arc(x,y,r,0,2*Math.PI);
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    drawImage(src,x,y,w,h,r=0){
        if(x > -10 && y > -10){
            this.ctx.rotate(toRad(r));
            let rot = Math.atan(x/y)*180/Math.PI;
            let dis = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
            this.ctx.drawImage(src,dis*(Math.sin(toRad(r+rot)))-w/2,dis*(Math.cos(toRad(r+rot)))-h/2,w,h);
            this.ctx.rotate(toRad(-r));
        }
    }
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const Canvas = new CanvasCreator();
// Canvas.ctx.imageSmoothingEnabled = true;
const elm = (id) => document.getElementById(id);
const toRad = (degree) => degree*Math.PI/180;
const toDeg = (radian) => radian*180/Math.PI;