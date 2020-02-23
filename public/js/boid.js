import { Vector2 } from "./util.js";
import { Game } from "./game.js";
import {
    boidWidth,
    boidHeight,
    boidGrav,
    boidStartingX,
    boidStartingY,
    boidJumpVel,
    pipeWidth
} from "./settings.js";

export class Boid {
    constructor(boidImage) {
        this.pos = new Vector2(boidStartingX, boidStartingY);
        this.vel = new Vector2(0, 0);
        this.isStarted = false;
        this.image = boidImage;
    }

    reset() {
        this.pos.set(boidStartingX, boidStartingY);
        this.vel = new Vector2(0, 0);
        this.isStarted = false;
    }

    update(deltaTime) {
        if (this.isStarted) {
            this.vel.set(this.vel.x, this.vel.y + boidGrav * deltaTime);
            this.pos.set(
                this.pos.x + this.vel.x * deltaTime,
                this.pos.y + this.vel.y * deltaTime
            );
        }
    }

    render(context) {
        context.drawImage(
            this.image,
            Math.floor(this.pos.x),
            Math.floor(this.pos.y)
        );
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
            this.pos.x < pipe.topPos.x + pipeWidth &&
            this.pos.x + boidWidth > pipe.topPos.x &&
            this.pos.y < pipe.topPos.y + pipe.topHeight &&
            this.pos.y + boidHeight > pipe.topPos.y
        ) {
            if (
                this.pos.x < pipe.topPos.x &&
                this.pos.x + boidWidth > pipe.topPos.x
            ) {
                left = this.pos.x + boidWidth - pipe.topPos.x;
            }

            if (
                this.pos.y < pipe.topPos.y + pipe.topHeight &&
                this.pos.y + boidHeight > pipe.topPos.y + pipe.topHeight
            ) {
                bottom = pipe.topPos.y + pipe.topHeight - this.pos.y;
            }

            if (left === 0 && bottom === 0) {
                throw new Error("WTFBBQ");
            } else if (left === 0) {
                return pipe.topPos.y + pipe.topHeight;
            } else if (bottom === 0) {
                Game.pipeGenerator.collided(pipe);
                return this.pos.y;
            } else {
                if (left < bottom) {
                    Game.pipeGenerator.collided(pipe);
                    return this.pos.y;
                } else {
                    return pipe.topPos.y + pipe.topHeight;
                }
            }
        }

        left = 0;
        let top = 0;
        if (
            this.pos.x < pipe.botPos.x + pipeWidth &&
            this.pos.x + boidWidth > pipe.botPos.x &&
            this.pos.y < pipe.botPos.y + pipe.botHeight &&
            this.pos.y + boidHeight > pipe.botPos.y
        ) {
            if (
                this.pos.x < pipe.botPos.x &&
                this.pos.x + boidWidth > pipe.botPos.x
            ) {
                left = this.pos.x + boidWidth - pipe.botPos.x;
            }

            if (
                this.pos.y + boidHeight > pipe.botPos.y &&
                this.pos.y < pipe.botPos.y
            ) {
                top = boidHeight + this.pos.y - pipe.botPos.y;
            }

            if (left === 0 && top === 0) {
                throw new Error("WTFBBQ");
            } else if (left === 0) {
                return pipe.botPos.y - boidHeight;
            } else if (top === 0) {
                Game.pipeGenerator.collided(pipe);
                return this.pos.y;
            } else {
                if (left < top) {
                    Game.pipeGenerator.collided(pipe);
                    return this.pos.y;
                } else {
                    return pipe.botPos.y - boidHeight;
                }
            }
        }
        return -1;
    }
}
