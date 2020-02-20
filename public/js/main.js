const canvas = document.getElementById("screen");
const context = canvas.getContext("2d");

function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Boid {
    constructor() {
        this.pos = new Vector2(150, 250);
        this.vel = new Vector2(0, 0);
        this.grav = 2400;
        this.isStarted = false;
    }

    update(deltaTime) {
        if (this.isStarted) {
            this.vel.set(
                this.vel.x,
                this.vel.y + (this.grav * deltaTime) / 1000
            );
            this.pos.set(
                this.pos.x + (this.vel.x * deltaTime) / 1000,
                this.pos.y + (this.vel.y * deltaTime) / 1000
            );
        }
    }

    render(context) {
        context.fillStyle = "yellow";
        context.fillRect(this.pos.x, this.pos.y, 32, 32);
    }
    jump() {
        this.isStarted = true;
        this.vel.y = -700;
    }
}

class Pipe {
    constructor(topHeight) {
        this.startingX = 800;
        this.width = 100;
        this.holeHeight = 250;
        this.topHeight = topHeight;
        this.botHeight = 600 - topHeight - this.holeHeight;
        this.topPos = new Vector2(this.startingX, 0);
        this.botPos = new Vector2(this.startingX, topHeight + this.holeHeight);
        this.speed = -120;
    }
    update(deltaTime) {
        this.topPos.set(
            this.topPos.x + (this.speed * deltaTime) / 1000,
            this.topPos.y
        );
        this.botPos.set(
            this.botPos.x + (this.speed * deltaTime) / 1000,
            this.botPos.y
        );
    }
    render(context) {
        context.fillStyle = "green";
        context.fillRect(
            this.topPos.x,
            this.topPos.y,
            this.width,
            this.topHeight
        );
        context.fillRect(
            this.botPos.x,
            this.botPos.y,
            this.width,
            this.botHeight
        );
    }
}

class PipeGenerator {
    constructor() {
        this.pipes = [];
        this.lastPipe = null;
        this.isStarted = false;
    }
    update(deltaTime) {
        if (this.isStarted) {
            if (this.pipes.length === 0) {
                const pipe = new Pipe(randomIntFromInterval(50, 250));
                this.pipes.push(pipe);
                this.lastPipe = pipe;
            } else {
                if (this.lastPipe.topPos.x <= 500) {
                    const pipe = new Pipe(randomIntFromInterval(50, 250));
                    this.pipes.push(pipe);
                    this.lastPipe = pipe;
                }
            }
            if (this.pipes[0].topPos.x < -100) {
                this.pipes.shift();
            }
            this.pipes.forEach(pipe => {
                pipe.update(deltaTime);
            });
        }
    }
    render(context) {
        this.pipes.forEach(pipe => {
            pipe.render(context);
        });
    }
    start() {
        this.isStarted = true;
    }
}

let lastTime = 0;
const boid = new Boid();
const pipeGenerator = new PipeGenerator();

function loop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    boid.update(deltaTime);
    pipeGenerator.update(deltaTime);

    context.fillStyle = "skyblue";
    context.fillRect(0, 0, 400, 600);
    pipeGenerator.render(context);
    boid.render(context);

    requestAnimationFrame(loop);
}

window.addEventListener("keydown", event => {
    if (event.code === "Space") {
        boid.jump();
        pipeGenerator.start();
    }
});

requestAnimationFrame(loop);
