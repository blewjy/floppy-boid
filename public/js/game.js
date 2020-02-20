import { Boid } from "./boid.js";
import { PipeGenerator } from "./pipe.js";
import { Collider } from "./collider.js";
import { gameWidth, gameHeight, gameGroundHeight } from "./settings.js";

export class Game {
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
    }

    static init() {
        new Game();
        window.addEventListener("keydown", event => {
            if (event.code === "Space") {
                Game.boid.jump();
                Game.pipeGenerator.start();
            }
        });
    }

    static start() {
        Game.isRunning = true;
        if (Game.isRunning) {
            requestAnimationFrame(timestamp => Game.loop(timestamp));
        }
    }

    static stop() {
        Game.isRunning = false;
    }

    static loop(timestamp) {
        // time management
        Game.deltaTime = (timestamp - Game.lastTime) / 1000;
        Game.lastTime = timestamp;

        // update entities
        Game.boid.update(Game.deltaTime);
        Game.pipeGenerator.update(Game.deltaTime);

        // check collisions
        Game.collider.check();

        // render
        Game.context.fillStyle = "skyblue";
        Game.context.fillRect(0, 0, gameWidth, gameHeight);
        Game.context.fillStyle = "brown";
        Game.context.fillRect(
            0,
            gameHeight - gameGroundHeight,
            gameWidth,
            gameGroundHeight
        );
        Game.pipeGenerator.render(Game.context);
        Game.boid.render(Game.context);

        if (Game.isRunning) {
            requestAnimationFrame(timestamp => Game.loop(timestamp));
        }
    }

    static get boid() {
        return Game.instance.boid;
    }

    static get pipeGenerator() {
        return Game.instance.pipeGenerator;
    }

    static get collider() {
        return Game.instance.collider;
    }

    static get context() {
        return Game.instance.context;
    }

    static get isRunning() {
        return Game.instance.isRunning;
    }

    static set isRunning(isRunning) {
        Game.instance.isRunning = isRunning;
    }

    static get deltaTime() {
        return Game.instance.deltaTime;
    }

    static set deltaTime(deltaTime) {
        Game.instance.deltaTime = deltaTime;
    }

    static get lastTime() {
        return Game.instance.lastTime;
    }

    static set lastTime(lastTime) {
        Game.instance.lastTime = lastTime;
    }
}
