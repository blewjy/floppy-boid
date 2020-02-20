import { randomIntFromInterval, Vector2 } from "./util.js";
import {
    boidStartingX,
    boidWidth,
    pipeWidth,
    pipeHoleHeight,
    gameHeight,
    pipeMoveSpeed,
    pipeStartingX,
    pipeGap,
    pipeMinHeight,
    pipeMaxHeight,
    pipeRemoveX
} from "./settings.js";
import { Game } from "./game.js";

class Pipe {
    constructor(pipeTopHeight) {
        this.topHeight = pipeTopHeight;
        this.botHeight = gameHeight - pipeTopHeight - pipeHoleHeight;
        this.topPos = new Vector2(pipeStartingX, 0);
        this.botPos = new Vector2(
            pipeStartingX,
            pipeTopHeight + pipeHoleHeight
        );
        this.passed = false;
    }
    update(deltaTime) {
        this.topPos.set(
            this.topPos.x + pipeMoveSpeed * deltaTime,
            this.topPos.y
        );
        this.botPos.set(
            this.botPos.x + pipeMoveSpeed * deltaTime,
            this.botPos.y
        );
        if (
            !this.passed &&
            this.topPos.x + pipeWidth / 2 <= boidStartingX + boidWidth / 2
        ) {
            this.passed = true;
            Game.addScore();
        }
    }
    render(context) {
        context.fillStyle = "green";
        context.fillRect(
            this.topPos.x,
            this.topPos.y,
            pipeWidth,
            this.topHeight
        );
        context.fillRect(
            this.botPos.x,
            this.botPos.y,
            pipeWidth,
            this.botHeight
        );
        context.strokeStyle = "black";
        context.beginPath();
        context.moveTo(this.topPos.x + pipeWidth / 2, 0);
        context.lineTo(this.botPos.x + pipeWidth / 2, gameHeight);
        context.stroke();
    }
}

export class PipeGenerator {
    constructor() {
        this.pipes = [];
        this.lastPipe = null;
        this.isStarted = false;
    }

    reset() {
        this.pipes.length = 0;
        this.lastPipe = null;
        this.isStarted = false;
    }

    /**
     * TODO: Refactor to not hardcode!!
     */
    collided() {
        if (this.pipes.length == 3) {
            this.pipes[0].topPos.set(boidStartingX + boidWidth, 0);
            this.pipes[0].botPos.set(
                boidStartingX + boidWidth,
                this.pipes[0].botPos.y
            );
            this.pipes[1].topPos.set(
                boidStartingX + boidWidth + pipeWidth + pipeGap,
                0
            );
            this.pipes[1].botPos.set(
                boidStartingX + boidWidth + pipeWidth + pipeGap,
                this.pipes[1].botPos.y
            );
        } else if (this.pipes.length === 4) {
            this.pipes[0].topPos.set(
                boidStartingX + boidWidth - pipeGap - pipeWidth,
                0
            );
            this.pipes[0].botPos.set(
                boidStartingX + boidWidth - pipeGap - pipeWidth,
                this.pipes[0].botPos.y
            );
            this.pipes[1].topPos.set(boidStartingX + boidWidth, 0);
            this.pipes[1].botPos.set(
                boidStartingX + boidWidth,
                this.pipes[1].botPos.y
            );
            this.pipes[2].topPos.set(
                boidStartingX + boidWidth + pipeWidth + pipeGap,
                0
            );
            this.pipes[2].botPos.set(
                boidStartingX + boidWidth + pipeWidth + pipeGap,
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
                    randomIntFromInterval(pipeMinHeight, pipeMaxHeight)
                );
                this.pipes.push(pipe);
                this.lastPipe = pipe;
            } else {
                if (
                    this.lastPipe.topPos.x <=
                    pipeStartingX - pipeGap - pipeWidth
                ) {
                    const pipe = new Pipe(
                        randomIntFromInterval(pipeMinHeight, pipeMaxHeight)
                    );
                    this.pipes.push(pipe);
                    this.lastPipe = pipe;
                }
            }
            if (this.pipes[0].topPos.x < pipeRemoveX) {
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
