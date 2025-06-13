class Car {
    constructor(x, y, width, height, controlType, maxSpeed=3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.friction = 0.05;
        this.maxSpeed = maxSpeed;
        this.angle = 0;
        this.damaged = false;

        // Carregando as imagens do carro
        this.img = new Image();
        this.img.src = "img/car.png";
        this.imgDamaged = new Image();
        this.imgDamaged.src = "img/carOver.png";
        this.imgLoaded = false;
        this.imgDamagedLoaded = false;
        
        this.img.onload = () => {
            this.imgLoaded = true;
            this.createCollisionMap();
        };
        this.imgDamaged.onload = () => {
            this.imgDamagedLoaded = true;
        };

        if (controlType === 'KEYS'){
            this.sensor = new Sensor(this);
        }
        this.controls = new Controls(controlType);
    }

    createCollisionMap() {
        // Cria um canvas temporário para analisar a imagem
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
        this.collisionMap = ctx.getImageData(0, 0, this.width, this.height);
    }

    #assessDamage(roadBorders, traffic) {
        if (!this.imgLoaded) return false;

        // Verifica colisão com as bordas da estrada
        const corners = [
            {x: this.x - this.width/2, y: this.y - this.height/2},
            {x: this.x + this.width/2, y: this.y - this.height/2},
            {x: this.x - this.width/2, y: this.y + this.height/2},
            {x: this.x + this.width/2, y: this.y + this.height/2}
        ];

        for (let i = 0; i < roadBorders.length; i++) {
            if (this.#checkLineCollision(roadBorders[i][0], roadBorders[i][1], corners)) {
                return true;
            }
        }

        // Verifica colisão com o tráfego
        for (let i = 0; i < traffic.length; i++) {
            const car = traffic[i];
            if (this.#checkCarCollision(car)) {
                return true;
            }
        }
        
        return false;
    }

    #checkLineCollision(start, end, corners) {
        // Reduz a área de colisão em 20% em cada lado
        const shrinkFactor = 0.2;
        const shrinkX = this.width * shrinkFactor;
        const shrinkY = this.height * shrinkFactor;
        
        const adjustedCorners = [
            {x: this.x - this.width/2 + shrinkX, y: this.y - this.height/2 + shrinkY},
            {x: this.x + this.width/2 - shrinkX, y: this.y - this.height/2 + shrinkY},
            {x: this.x + this.width/2 - shrinkX, y: this.y + this.height/2 - shrinkY},
            {x: this.x - this.width/2 + shrinkX, y: this.y + this.height/2 - shrinkY}
        ];

        for (let i = 0; i < adjustedCorners.length; i++) {
            const current = adjustedCorners[i];
            const next = adjustedCorners[(i + 1) % adjustedCorners.length];
            if (getIntersection(start, end, current, next)) {
                return true;
            }
        }
        return false;
    }

    #checkCarCollision(otherCar) {
        // Reduz a área de colisão para 60% do tamanho da imagem
        const collisionWidth = this.width * 0.6;
        const collisionHeight = this.height * 0.6;
        const otherCollisionWidth = otherCar.width * 0.6;
        const otherCollisionHeight = otherCar.height * 0.6;

        const dx = Math.abs(this.x - otherCar.x);
        const dy = Math.abs(this.y - otherCar.y);
        
        return dx < (collisionWidth + otherCollisionWidth) / 2 &&
               dy < (collisionHeight + otherCollisionHeight) / 2;
    }

    update(roadBorders, traffic = []) {
        if (!this.damaged){
            this.#move();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }
        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
        }
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
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        if (this.damaged && this.imgDamagedLoaded) {
            ctx.drawImage(
                this.imgDamaged,
                -this.width/2,
                -this.height/2,
                this.width,
                this.height
            );
        } else if (!this.damaged && this.imgLoaded) {
            ctx.drawImage(
                this.img,
                -this.width/2,
                -this.height/2,
                this.width,
                this.height
            );
        }
        
        ctx.restore();

        if (this.sensor) {
            //this.sensor.draw(ctx);
        }
    }
}