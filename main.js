const canvas = document.getElementById('myCanvas');
//canvas.height = window.innerHeight;
canvas.width = 300; // Aumentado de 200 para 300

const ctx = canvas.getContext("2d");

const road = new Road(canvas.width/2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 45, 75, 'KEYS'); // Aumentado para 45x75
const traffic = [
    new Car(road.getLaneCenter(0), -100, 45, 75, 'DUMMY', 2), // Aumentado para 45x75
    new Car(road.getLaneCenter(1), -300, 45, 75, 'DUMMY', 2), // Aumentado para 45x75
    new Car(road.getLaneCenter(2), -500, 45, 75, 'DUMMY', 2)  // Aumentado para 45x75
];

animate();

function animate() {
    for (let i = 0; i < traffic.length; i++) {
        // Removendo o carro atual do array de tráfego para evitar auto-colisão
        const otherCars = traffic.filter((_, index) => index !== i);
        traffic[i].update(road.borders, otherCars);
    }
    car.update(road.borders, traffic);

    canvas.height = window.innerHeight;
    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.7);
    road.draw(ctx);
    
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(ctx);
    }
    car.draw(ctx);
    ctx.restore()
    requestAnimationFrame(animate);
}