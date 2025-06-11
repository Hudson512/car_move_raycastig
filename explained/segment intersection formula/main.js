const myCanvas = document.getElementById('myCanvas');
myCanvas.height = window.innerHeight;
myCanvas.width = window.innerWidth;

const A = { x: 100, y: 100 };
const B = { x: 200, y: 200 };
const C = { x: 100, y: 200 };
const D = { x: 200, y: 100 };

const ctx = myCanvas.getContext('2d');

const mouse = {
    x: 0,
    y: 0,
};
document.onmousemove = (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
}

animate();

function animate()
{
    const radius = 50
    A.x = mouse.x;
    A.y = mouse.y - radius;
    B.x = mouse.x;
    B.y = mouse.y + radius;
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.moveTo(C.x, C.y);
    ctx.lineTo(D.x, D.y);
    ctx.stroke();

    drawLine(A, B, 'blue');
    drawLine(C, D, 'green');
    drawDot(A, 'A');
    drawDot(B, 'B');
    drawDot(C, 'C');
    drawDot(D, 'D');

    const intersection = getIntersection(A, B, C, D);
    if (intersection) {
        drawDot(intersection, 'I');
        console.table(intersection);
    }

    requestAnimationFrame(animate);
}

function getIntersection(A, B, C, D) {
    const top = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y) ;
    
    if (bottom !== 0) {
        const t = top / bottom;
        if (t >= 0 && t <= 1){
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
        }
    }
    return null;
}


function lerp(a, b, t) {
    return a + (b - a) * t;
}

function drawLine(A, B, color = 'black') {
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.strokeStyle = color;
    ctx.stroke();
}
function drawDot(point, label, isRed) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = isRed ? 'red' : 'white';
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.font = "bold 12px Arial";
    ctx.textBaseline = 'middle';
    ctx.fillText(label, point.x, point.y);
}