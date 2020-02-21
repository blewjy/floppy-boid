import { Boid } from "./boid.js";
import { PipeGenerator } from "./pipe.js";
import { Collider } from "./collider.js";
import { gameWidth, gameHeight, gameGroundHeight } from "./settings.js";

export class Game {
    constructor() {
        Game.instance = this;

        this.screenCanvas = document.getElementById("screen");
        this.screenContext = this.screenCanvas.getContext("2d");

        this.uiCanvas = document.getElementById("ui");
        this.uiContext = this.uiCanvas.getContext("2d");
        this.uiContext.fillStyle = "white";


        this.lastTime = 0;
        this.deltaTime = 0;

        this.boid = new Boid();
        this.pipeGenerator = new PipeGenerator();
        this.collider = new Collider(this.boid, this.pipeGenerator.pipes);

        this.score = 0;

        this.isRunning = false;
        this.isPipesComing = false;
        this.isGameOver = false;
        this.isFirstDrawDone = false;
        this.isGetReadyCleared = false;
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
        window.addEventListener("mousedown", event => {
            if (event.which === 1) {
                Game.boid.jump();
                Game.pipeGenerator.start();
                Game.isPipesComing = true;
            }
        });
    }

    static reset() {
        Game.boid.reset();
        Game.pipeGenerator.reset();
        Game.score = 0;
        Game.isPipesComing = false;
        Game.isFirstDrawDone = false;
        Game.isGetReadyCleared = false;
    }

    static start() {
        Game.isRunning = true;
        Game.isGameOver = false;
        if (Game.isRunning) {
            // Draw background on background canvas
            const backgroundCanvas = document.getElementById("background");
            const backgroundContext = backgroundCanvas.getContext("2d", {
                alpha: false
            });
            backgroundContext.fillStyle = "skyblue";
            backgroundContext.fillRect(0, 0, gameWidth, gameHeight);
            backgroundContext.fillStyle = "brown";
            backgroundContext.fillRect(
                0,
                gameHeight - gameGroundHeight,
                gameWidth,
                gameGroundHeight
            );

            // Start game loop
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
        if (!Game.isFirstDrawDone || Game.isPipesComing) {
            if (!Game.isFirstDrawDone) {
                Game.uiContext.clearRect(0, 170, gameWidth, 80);
            }

            Game.screenContext.clearRect(0, 0, gameWidth, gameHeight);
            Game.pipeGenerator.render(Game.screenContext);
            Game.boid.render(Game.screenContext);
            // Game.drawScore();

            if (Game.isGameOver) {
                
                Game.uiContext.fillText("Game Over!", gameWidth / 2, 200);
                Game.uiContext.font = "30px Georgia";
                Game.uiContext.fillText(
                    'Press "Enter" to restart',
                    gameWidth / 2,
                    250
                );
            }

            if (!Game.isFirstDrawDone) {
                Game.drawScore();
                Game.uiContext.fillText("Get Ready", gameWidth / 2, 200);
            } else if (!Game.isGameOver && !Game.isGetReadyCleared) {
                Game.uiContext.clearRect(85, 170, 230, 40);
                Game.isGetReadyCleared = true;
            }
            Game.isFirstDrawDone = true;
        }

        if (Game.isRunning) {
            requestAnimationFrame(timestamp => Game.loop(timestamp));
        }
    }

    static addScore() {
        Game.instance.score += 1;
        Game.drawScore();
    }

    static drawScore() {
        Game.uiContext.font = "bold 40px Georgia";
        Game.uiContext.textAlign = "center";
        Game.uiContext.clearRect(gameWidth / 4, 25, gameWidth / 2, 40);
        Game.uiContext.fillText(Game.score, gameWidth / 2, 60);
    }

    // Static getters and setters

    static get boid() {
        return Game.instance.boid;
    }

    static get pipeGenerator() {
        return Game.instance.pipeGenerator;
    }

    static get collider() {
        return Game.instance.collider;
    }

    static get screenContext() {
        return Game.instance.screenContext;
    }

    static get uiContext() {
        return Game.instance.uiContext;
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

    static get isFirstDrawDone() {
        return Game.instance.isFirstDrawDone;
    }

    static set isFirstDrawDone(isFirstDrawDone) {
        Game.instance.isFirstDrawDone = isFirstDrawDone;
    }

    static get isGetReadyCleared() {
        return Game.instance.isGetReadyCleared;
    }

    static set isGetReadyCleared(isGetReadyCleared) {
        Game.instance.isGetReadyCleared = isGetReadyCleared;
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
