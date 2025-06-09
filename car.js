class Car {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.color = 'blue'; // Default color
        this.speed = 0;
        this.acceleration = 0.2;
        this.friction = 0.05;
        this.maxSpeed = 3;
        this.angle = 0;
        this.controls = new Controls();
        this.#move();
    }

    update() {
        this.#move();
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
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);
        ctx.beginPath();
        ctx.rect(
            -this.width/2, 
            -this.height/2, 
            this.width, 
            this.height);
        ctx.fillStyle = this.color;
        ctx.fill()
        ctx.restore();
    }
}