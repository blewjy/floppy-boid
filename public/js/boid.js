import { Vector2 } from "./util.js";
import { Game } from "./game.js";
import {
    boidWidth,
    boidHeight,
    boidGrav,
    boidStartingX,
    boidStartingY,
    boidJumpVel
} from "./settings.js";

export class Boid {
    constructor() {
        this.width = boidWidth;
        this.height = boidHeight;
        this.pos = new Vector2(boidStartingX, boidStartingY);
        this.vel = new Vector2(0, 0);
        this.grav = boidGrav;
        this.isStarted = false;
    }

    update(deltaTime) {
        if (this.isStarted) {
            this.vel.set(this.vel.x, this.vel.y + this.grav * deltaTime);
            this.pos.set(
                this.pos.x + this.vel.x * deltaTime,
                this.pos.y + this.vel.y * deltaTime
            );
        }
    }

    render(context) {
        context.fillStyle = "yellow";
        context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        context.strokeStyle = "black";
        context.beginPath();
        context.moveTo(this.pos.x + this.width / 2, this.pos.y);
        context.lineTo(this.pos.x + this.width / 2, this.pos.y + this.height);
        context.stroke();
    }
    jump() {
        this.isStarted = true;
        this.vel.y = boidJumpVel;
    }

    /**
     * TODO: Refactor to make it not so messy?!
     */
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
                return pipe.topPos.y + pipe.topHeight;
            } else if (bottom === 0) {
                Game.pipeGenerator.collided();
                return this.pos.y;
            } else {
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
                return pipe.botPos.y - this.height;
            } else if (top === 0) {
                Game.pipeGenerator.collided();
                return this.pos.y;
            } else {
                return left < top ? this.pos.y : pipe.botPos.y - this.height;
            }
        }
        return -1;
    }

    kill() {
        Game.stop();
    }
}
