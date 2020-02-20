import { Game } from "./game.js";
import { gameHeight, gameGroundHeight, boidHeight } from "./settings.js";

export class Collider {
    constructor(boid, pipes) {
        this.boid = boid;
        this.pipes = pipes;
    }

    check() {
        if (this.boid.pos.y >= gameHeight - gameGroundHeight - boidHeight) {
            this.boid.pos.set(
                this.boid.pos.x,
                gameHeight - gameGroundHeight - boidHeight
            );
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
