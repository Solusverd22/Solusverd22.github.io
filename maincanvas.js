var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

var particleCount = 1000
var frameDelta = 1;
var lastFrame = 0;
var mouseX = innerWidth/2;
var mouseY = innerHeight/2;
timeout = false, // holder for resizetimeout id
delay = 250, // delay after resizeevent is "complete" to run callback

document.onmousemove = function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
};

function dist(thing){
    distance = Math.pow(thing.x - mouseX,2) + Math.pow(thing.y - mouseY,2);
    distance = distance/10000;
    return distance;
}

function particle(x,y,yVel,radius) {
    this.radius = radius;
    this.yVel = yVel;
    this.x = x;
    this.y = y;
    var minSize = 20
    
    this.draw = function () {
        this.y -= this.yVel * frameDelta;
        if(this.y < -this.radius){
            this.y = innerHeight+this.radius;
        }

        // if(this.radius > radius){
        //     this.radius -= 0.1;
        // }
        var mousedistance = dist(this)
        this.radius = minSize+mousedistance*5;
        if(this.radius > 100){
            this.radius = 100;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        // ctx.fillStyle = "rgba(60, 60, 60," + (radius-8)/10 +")";
        var shade = ((this.radius-minSize)/90);
        shade = 1 - shade
        var colr = shade * 156;
        var colb = shade * 89;
        var colg = shade * 209;
        var color = "rgb("+colr+", "+colb+", "+colg+")";
        ctx.fillStyle = color;
        ctx.fill();
    }
}

var particles = [];

function create_particles() {
    for (let i = 0; i < particleCount; i++) {
        particles[i] = new particle(Math.random() * innerWidth, Math.random() * innerHeight, Math.random()/2,Math.random());
        }
}
create_particles()

window.addEventListener('resize', function() {
    // clear the timeout
    clearTimeout(timeout);
    // start timing for event "completion"
    timeout = setTimeout(getDimensions, delay);
});

// window.resize callback function
function getDimensions() {
    create_particles();
}

function loop() {
    now = new Date().getMilliseconds();
    frameDelta = now - lastFrame;
    if(frameDelta < 0 ) frameDelta += 1000;
    frameDelta = frameDelta/10;


    canvas.width = innerWidth;
    canvas.height = innerHeight;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particleCount; i++) {
        particles[i].draw();
    }

    lastFrame = now;
    requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);