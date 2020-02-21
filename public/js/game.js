import { Boid } from "./boid.js";
import { PipeGenerator } from "./pipe.js";
import { Collider } from "./collider.js";
import { gameWidth, gameHeight, gameGroundHeight } from "./settings.js";

export class Game {
    constructor() {
        Game.instance = this;

        this.canvas = document.getElementById("screen");
        this.context = this.canvas.getContext("2d", { alpha: false });
        this.lastTime = 0;
        this.deltaTime = 0;

        this.boid = new Boid();
        this.pipeGenerator = new PipeGenerator();
        this.collider = new Collider(this.boid, this.pipeGenerator.pipes);

        this.score = 0;

        this.isRunning = false;
        this.isPipesComing = false;
        this.isGameOver = false;
    }

    static init() {
        new Game();
        window.addEventListener("keydown", event => {
            if (event.code === "Space") {
                Game.boid.jump();
                Game.pipeGenerator.start();
                Game.isPipesComing = true;
            } else if (event.code === "Enter" && Game.isGameOver) {
                Game.reset();
                Game.start();
            }
        });
    }

    static reset() {
        Game.boid.reset();
        Game.pipeGenerator.reset();
        Game.score = 0;
        Game.isPipesComing = false;
    }

    static start() {
        Game.isRunning = true;
        Game.isGameOver = false;
        if (Game.isRunning) {
            requestAnimationFrame(timestamp => Game.loop(timestamp));
        }
    }

    static stop() {
        Game.isRunning = false;
    }

    static gameOver() {
        Game.stop();
        Game.isGameOver = true;
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
        Game.context.fillStyle = "white";
        Game.context.font = "bold 40px Georgia";
        Game.context.textAlign = "center";
        Game.context.fillText(Game.score, gameWidth / 2, 60);

        if (!Game.isPipesComing) {
            Game.context.fillText("Get Ready", gameWidth / 2, 200);
        }

        if (Game.isGameOver) {
            Game.context.fillText("Game Over!", gameWidth / 2, 200);
            Game.context.font = "30px Georgia";
            Game.context.fillText(
                'Press "Enter" to restart',
                gameWidth / 2,
                250
            );
        }

        if (Game.isRunning) {
            requestAnimationFrame(timestamp => Game.loop(timestamp));
        }
    }

    static addScore() {
        Game.instance.score += 1;
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

    static get isPipesComing() {
        return Game.instance.isPipesComing;
    }

    static set isPipesComing(isPipesComing) {
        Game.instance.isPipesComing = isPipesComing;
    }

    static get isGameOver() {
        return Game.instance.isGameOver;
    }

    static set isGameOver(isGameOver) {
        Game.instance.isGameOver = isGameOver;
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

    static get score() {
        return Game.instance.score;
    }

    static set score(score) {
        Game.instance.score = score;
    }
}
