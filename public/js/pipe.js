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
    pipeRemoveX,
    gameGroundHeight,
    pipeImageWidth,
    pipeImageHeight
} from "./settings.js";
import { Game } from "./game.js";

class Pipe {
    constructor(pipeTopHeight, topPipeImage, botPipeImage) {
        this.topHeight = pipeTopHeight;
        this.botHeight =
            gameHeight - pipeTopHeight - pipeHoleHeight - gameGroundHeight;
        this.topPos = new Vector2(pipeStartingX, 0);
        this.botPos = new Vector2(
            pipeStartingX,
            pipeTopHeight + pipeHoleHeight
        );
        this.passed = false;
        this.topPipeImage = topPipeImage;
        this.botPipeImage = botPipeImage;
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
        context.drawImage(
            this.topPipeImage,
            Math.floor(this.topPos.x),
            Math.floor(this.topPos.y - pipeImageHeight + this.topHeight)
        );
        context.drawImage(
            this.botPipeImage,
            0,
            0,
            pipeImageWidth,
            this.botHeight,
            Math.floor(this.botPos.x),
            Math.floor(this.botPos.y),
            pipeImageWidth,
            this.botHeight
        );
    }
}

export class PipeGenerator {
    constructor(pipeImage) {
        this.pipes = [];
        this.lastPipe = null;
        this.isStarted = false;

        // Draw top pipe
        this.topPipeImageBuffer = document.createElement("canvas");
        this.topPipeImageBuffer.width = pipeImageWidth;
        this.topPipeImageBuffer.height = pipeImageHeight;
        const topBufferContext = this.topPipeImageBuffer.getContext("2d");
        topBufferContext.scale(1, -1);
        topBufferContext.translate(0, -pipeImageHeight);
        topBufferContext.drawImage(pipeImage, 0, 0);

        // Draw bottom pipe
        this.botPipeImageBuffer = document.createElement("canvas");
        this.botPipeImageBuffer.width = pipeImageWidth;
        this.botPipeImageBuffer.height = pipeImageHeight;
        const botBufferContext = this.botPipeImageBuffer.getContext("2d");
        botBufferContext.drawImage(pipeImage, 0, 0);
    }

    reset() {
        this.pipes.length = 0;
        this.lastPipe = null;
        this.isStarted = false;
    }

    collided(pipe) {
        const index = this.pipes.findIndex(p => p === pipe);
        for (let i = 0; i < this.pipes.length; i++) {
            const currentPipe = this.pipes[i];
            if (i < index) {
                currentPipe.topPos.set(
                    boidStartingX +
                        boidWidth -
                        (index - i) * (pipeWidth + pipeGap),
                    0
                );
                currentPipe.botPos.set(
                    boidStartingX +
                        boidWidth -
                        (index - i) * (pipeWidth + pipeGap),
                    currentPipe.botPos.y
                );
            } else if (i > index) {
                currentPipe.topPos.set(
                    boidStartingX +
                        boidWidth +
                        (i - index) * (pipeWidth + pipeGap),
                    0
                );
                currentPipe.botPos.set(
                    boidStartingX +
                        boidWidth +
                        (i - index) * (pipeWidth + pipeGap),
                    currentPipe.botPos.y
                );
            } else {
                currentPipe.topPos.set(boidStartingX + boidWidth, 0);
                currentPipe.botPos.set(
                    boidStartingX + boidWidth,
                    currentPipe.botPos.y
                );
            }
        }
    }

    update(deltaTime) {
        if (this.isStarted) {
            if (this.pipes.length === 0) {
                const pipe = new Pipe(
                    randomIntFromInterval(pipeMinHeight, pipeMaxHeight),
                    this.topPipeImageBuffer,
                    this.botPipeImageBuffer
                );
                this.pipes.push(pipe);
                this.lastPipe = pipe;
            } else {
                if (
                    this.lastPipe.topPos.x <=
                    pipeStartingX - pipeGap - pipeWidth
                ) {
                    const pipe = new Pipe(
                        randomIntFromInterval(pipeMinHeight, pipeMaxHeight),
                        this.topPipeImageBuffer,
                        this.botPipeImageBuffer
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
        context.fillStyle = "green";
        this.pipes.forEach(pipe => {
            pipe.render(context);
        });
    }
    start() {
        this.isStarted = true;
    }
}
