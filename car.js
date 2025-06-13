class Car {
    constructor(x, y, width, height, controlType, maxSpeed=3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.baseColor = 'gray';  // Cor base do carro
        this.color = this.baseColor;
        this.speed = 0;
        this.acceleration = 0.2;
        this.friction = 0.05;
        this.maxSpeed = maxSpeed;
        this.angle = 0;
        this.damaged = false;

        if (controlType === 'KEYS'){
            this.sensor = new Sensor(this);
            this.baseColor = 'blue';
        }
        this.controls = new Controls(controlType);
        //this.#move();
    }

    update(roadBorders, traffic = []) {
        if (!this.damaged){
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
            this.#updateColor();
        }
        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
        }
    }

    #updateColor() {
        if (!this.sensor) {
            this.color = this.baseColor; // Se não houver sensor, mantém a cor base
            return;
        }
        const dangerLevel = this.sensor.getDangerLevel();
        if (dangerLevel > 0) {
            // Interpola entre azul e vermelho baseado no nível de perigo
            const blue = Math.floor(255 * (1 - dangerLevel));
            const red = Math.floor(255 * dangerLevel);
            this.color = `rgb(${red}, 0, ${blue})`;
        } else {
            this.color = this.baseColor;
        }
    }

    #assessDamage(roadBorders, traffic) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }
        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }
        return false;
    }

    

    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.height, this.width);

        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        });
        return points;
    }

    #move() {
        // Update position based on speed
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }
        // Limit the speed
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        if (this.speed < -this.maxSpeed) {
            this.speed = -this.maxSpeed/2;
        }

        // Apply friction
        if (this.speed > 0) {
            this.speed -= this.friction;
        } else if (this.speed < 0) {
            this.speed += this.friction;
        }

        // Stop the car if speed is very low
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        // Update position based on speed and angle
        if (this.speed !== 0) {
            const direction = this.speed > 0 ? 1 : -1;
            if (this.controls.left) {
                this.angle += 0.03 * direction;
            }
            if (this.controls.right) {
                this.angle -= 0.03 * direction;
            }
        }

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;;
    }

    draw(ctx) {
        if (this.damaged) {
            ctx.fillStyle = 'red'; // Change color to red if damaged
        }
        else {
            ctx.fillStyle = this.color; // Use the car's color
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        if (this.sensor) {
            this.sensor.draw(ctx);
        }
    }
}