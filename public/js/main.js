function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const Sides = {
    TOP: "top",
    BOTTOM: "bottom",
    LEFT: "left",
    NONE: "none",
};

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

class Entity {
    constructor(type) {
        this.type = type;
    }
}

class Boid extends Entity {
    constructor() {
        super("boid");
        this.width = 32;
        this.height = 32;
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
        context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }
    jump() {
        this.isStarted = true;
        this.vel.y = -700;
    }

    // TODO: Buggy, not perfect. 
    //       - boid.pos.x should not change. 
    hits(pipe) {
        if (
            this.pos.y < pipe.topHeight &&
            this.pos.x < pipe.topPos.x + pipe.width
        ) {
            if (this.pos.x > pipe.topPos.x) {
                // from bottom
                return new Vector2(this.pos.x, pipe.topHeight);
            } else if (this.pos.x + this.width > pipe.topPos.x) {
                // from left side
                return new Vector2(pipe.topPos.x - this.width, this.pos.y);
            }
        }

        if (this.pos.y + this.height > pipe.topHeight + pipe.holeHeight) {
            if (this.pos.x > pipe.topPos.x) {
                // from top
                return new Vector2(
                    this.pos.x,
                    pipe.topHeight + pipe.holeHeight - this.height
                );
            } else if (this.pos.x + this.width > pipe.botPos.x) {
                // from left side
                return new Vector2(pipe.topPos.x - this.width, this.pos.y);
            }
        }

        return undefined;
    }
    kill() {
        Game.stop();
    }
}

class Pipe extends Entity {
    constructor(topHeight) {
        super("pipe");
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

class Collider {
    constructor(boid, pipes) {
        this.boid = boid;
        this.pipes = pipes;
    }

    check() {
        if (this.boid.pos.y >= 518) {
            this.boid.pos.set(this.boid.pos.x, 518);
            this.boid.kill();
        }
        this.pipes.forEach(pipe => {
            const pos = this.boid.hits(pipe);
            if (pos !== undefined) {
                console.log(pos);
                this.boid.pos.set(pos.x, pos.y);
                this.boid.kill();
            }
        });
    }
}

/**
 * TODO:
 * - Wrap all in Game object that can start and stop your update and render loops, and show menu, etc.
 */

class Game {
    constructor() {
        Game.instance = this;

        this.canvas = document.getElementById("screen");
        this.context = this.canvas.getContext("2d");
        this.lastTime = 0;
        this.deltaTime = 0;

        this.boid = new Boid();
        this.pipeGenerator = new PipeGenerator();
        this.collider = new Collider(this.boid, this.pipeGenerator.pipes);

        this.isRunning = false;

        window.addEventListener("keydown", event => {
            if (event.code === "Space") {
                this.boid.jump();
                this.pipeGenerator.start();
            }
        });
    }

    static loop(timestamp) {
        Game.instance.deltaTime = timestamp - Game.instance.lastTime;
        Game.instance.lastTime = timestamp;
        Game.instance.boid.update(Game.instance.deltaTime);
        Game.instance.pipeGenerator.update(Game.instance.deltaTime);
        Game.instance.collider.check();

        Game.instance.context.fillStyle = "skyblue";
        Game.instance.context.fillRect(0, 0, 400, 600);
        Game.instance.context.fillStyle = "brown";
        Game.instance.context.fillRect(0, 550, 400, 50);
        Game.instance.pipeGenerator.render(Game.instance.context);
        Game.instance.boid.render(Game.instance.context);

        if (Game.instance.isRunning) {
            requestAnimationFrame(timestamp => Game.loop(timestamp));
        }
    }

    static init() {
        new Game();
    }

    static start() {
        Game.instance.isRunning = true;
        if (Game.instance.isRunning) {
            requestAnimationFrame(timestamp => Game.loop(timestamp));
        }
    }

    static stop() {
        Game.instance.isRunning = false;
    }
}

Game.init();
Game.start();
