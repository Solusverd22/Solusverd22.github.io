var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

function loop() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    ctx.rect(0,0,innerWidth,innerHeight);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.stroke();

    requestAnimationFrame(loop);
    ctx.beginPath();
    ctx.arc(200, 200, 100, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
    console.log("looping");
}

loop();