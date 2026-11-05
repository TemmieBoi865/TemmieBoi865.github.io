const ob = (id) => Objects.getObjectById(id)

function start(){
    var frame = 0;
    setInterval(function(){
        Canvas.ctx.clearRect(0,0,1830,1025);
        Objects.drawAll();
        Objects.simulateAll();
    },16.6)
}

document.addEventListener('keydown',(event)=>{
});