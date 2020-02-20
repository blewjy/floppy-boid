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

class Pipe {
    constructor(pipeTopHeight) {
        this.startingX = pipeStartingX;
        this.width = pipeWidth;
        this.holeHeight = pipeHoleHeight;
        this.topHeight = pipeTopHeight;
        this.botHeight = gameHeight - pipeTopHeight - this.holeHeight;
        this.topPos = new Vector2(this.startingX, 0);
        this.botPos = new Vector2(
            this.startingX,
            pipeTopHeight + this.holeHeight
        );
        this.speed = pipeMoveSpeed;
    }
    update(deltaTime) {
        this.topPos.set(this.topPos.x + this.speed * deltaTime, this.topPos.y);
        this.botPos.set(this.botPos.x + this.speed * deltaTime, this.botPos.y);
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

export class PipeGenerator {
    constructor() {
        this.pipeGap = pipeGap;
        this.pipes = [];
        this.lastPipe = null;
        this.isStarted = false;
    }

    /**
     * TODO: Refactor to not hardcode!!
     */
    collided() {
        if (this.pipes.length == 2) {
            this.pipes[0].topPos.set(boidStartingX + boidWidth, 0);
            this.pipes[0].botPos.set(
                boidStartingX + boidWidth,
                this.pipes[0].botPos.y
            );
            this.pipes[1].topPos.set(
                boidStartingX + boidWidth + pipeWidth + this.pipeGap,
                0
            );
            this.pipes[1].botPos.set(
                boidStartingX + boidWidth + pipeWidth + this.pipeGap,
                this.pipes[1].botPos.y
            );
        } else if (this.pipes.length === 3) {
            this.pipes[0].topPos.set(
                boidStartingX + boidWidth - this.pipeGap - pipeWidth,
                0
            );
            this.pipes[0].botPos.set(
                boidStartingX + boidWidth - this.pipeGap - pipeWidth,
                this.pipes[0].botPos.y
            );
            this.pipes[1].topPos.set(boidStartingX + boidWidth, 0);
            this.pipes[1].botPos.set(
                boidStartingX + boidWidth,
                this.pipes[1].botPos.y
            );
            this.pipes[2].topPos.set(
                boidStartingX + boidWidth + pipeWidth + this.pipeGap,
                0
            );
            this.pipes[2].botPos.set(
                boidStartingX + boidWidth + pipeWidth + this.pipeGap,
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
                    pipeStartingX - this.pipeGap - pipeWidth
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
