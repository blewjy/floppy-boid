function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const Sides = {
    TOP: "top",
    BOTTOM: "bottom",
    LEFT: "left",
    NONE: "none"
};

const boidX = 150;
const boidWidth = 32;
const pipeWidth = 100;

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
        this.width = boidWidth;
        this.height = 32;
        this.pos = new Vector2(boidX, 250);
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
        let left = 0;
        let bottom = 0;
        if (
            this.pos.x < pipe.topPos.x + pipe.width &&
            this.pos.x + this.width > pipe.topPos.x &&
            this.pos.y < pipe.topPos.y + pipe.topHeight &&
            this.pos.y + this.height > pipe.topPos.y
        ) {
            if (
                this.pos.x < pipe.topPos.x &&
                this.pos.x + this.width > pipe.topPos.x
            ) {
                left = this.pos.x + this.width - pipe.topPos.x;
            }

            if (
                this.pos.y < pipe.topPos.y + pipe.topHeight &&
                this.pos.y + this.height > pipe.topPos.y + pipe.topHeight
            ) {
                bottom = pipe.topPos.y + pipe.topHeight - this.pos.y;
            }

            if (left === 0 && bottom === 0) {
                throw new Error("WTFBBQ");
            } else if (left === 0) {
                console.log("Hit from bottom");
                return pipe.topPos.y + pipe.topHeight;
            } else if (bottom === 0) {
                console.log("Hit from left");
                Game.pipeGenerator.collided();
                return this.pos.y;
            } else {
                console.log(
                    left < bottom ? "Hit from left" : "Hit from bottom"
                );
                return left < bottom
                    ? this.pos.y
                    : pipe.topPos.y + pipe.topHeight;
            }

            return true;
        }

        left = 0;
        let top = 0;
        if (
            this.pos.x < pipe.botPos.x + pipe.width &&
            this.pos.x + this.width > pipe.botPos.x &&
            this.pos.y < pipe.botPos.y + pipe.botHeight &&
            this.pos.y + this.height > pipe.botPos.y
        ) {
            if (
                this.pos.x < pipe.botPos.x &&
                this.pos.x + this.width > pipe.botPos.x
            ) {
                left = this.pos.x + this.width - pipe.botPos.x;
            }

            if (
                this.pos.y + this.height > pipe.botPos.y &&
                this.pos.y < pipe.botPos.y
            ) {
                top = this.height + this.pos.y - pipe.botPos.y;
            }

            if (left === 0 && top === 0) {
                throw new Error("WTFBBQ");
            } else if (left === 0) {
                console.log("Hit from top");
                return pipe.botPos.y - this.height;
            } else if (top === 0) {
                console.log("Hit from left");
                Game.pipeGenerator.collided();
                return this.pos.y;
            } else {
                console.log(left < top ? "Hit from left" : "Hit from top");
                return left < top ? this.pos.y : pipe.botPos.y - this.height;
            }
        }
        return -1;
    }
    kill() {
        Game.stop();
    }
}

class Pipe extends Entity {
    constructor(topHeight, startingX) {
        super("pipe");
        this.startingX = startingX;
        this.width = pipeWidth;
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
        this.startingX = 400;
        this.pipeGap = 100;
        this.pipes = [];
        this.lastPipe = null;
        this.isStarted = false;
    }

    collided() {
        if (this.pipes.length == 2) {
            this.pipes[0].topPos.set(boidX + boidWidth, 0);
            this.pipes[0].botPos.set(boidX + boidWidth, this.pipes[0].botPos.y);
            this.pipes[1].topPos.set(
                boidX + boidWidth + pipeWidth + this.pipeGap,
                0
            );
            this.pipes[1].botPos.set(
                boidX + boidWidth + pipeWidth + this.pipeGap,
                this.pipes[1].botPos.y
            );
        } else if (this.pipes.length === 3) {
            this.pipes[0].topPos.set(
                boidX + boidWidth - this.pipeGap - pipeWidth,
                0
            );
            this.pipes[0].botPos.set(
                boidX + boidWidth - this.pipeGap - pipeWidth,
                this.pipes[0].botPos.y
            );
            this.pipes[1].topPos.set(boidX + boidWidth, 0);
            this.pipes[1].botPos.set(boidX + boidWidth, this.pipes[1].botPos.y);
            this.pipes[2].topPos.set(
                boidX + boidWidth + pipeWidth + this.pipeGap,
                0
            );
            this.pipes[2].botPos.set(
                boidX + boidWidth + pipeWidth + this.pipeGap,
                this.pipes[2].botPos.y
            );
        } else {
            throw new Error("GGWP");
        }
    }

    update(deltaTime) {
        if (this.isStarted) {
            if (this.pipes.length === 0) {
                const pipe = new Pipe(
                    randomIntFromInterval(50, 250),
                    this.startingX
                );
                this.pipes.push(pipe);
                this.lastPipe = pipe;
            } else {
                if (
                    this.lastPipe.topPos.x <=
                    this.startingX - this.pipeGap - pipeWidth
                ) {
                    const pipe = new Pipe(
                        randomIntFromInterval(50, 250),
                        this.startingX
                    );
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
            const y = this.boid.hits(pipe);
            if (y !== -1) {
                this.boid.pos.set(this.boid.pos.x, y);
                Game.stop();
            }
        });
    }
}

/**
 * TODO:
 * - Wrap all in Game object that can start and stop your update and render loops, and show menu, etc.
 */

class Game {
    static get pipeGenerator() {
        return Game.instance.pipeGenerator;
    }

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
