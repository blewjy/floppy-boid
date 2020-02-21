import { Boid } from "./boid.js";
import { PipeGenerator } from "./pipe.js";
import { Collider } from "./collider.js";
import { gameWidth, gameHeight, gameGroundHeight } from "./settings.js";

export class Game {
    constructor() {
        Game.instance = this;

        this.backgroundCanvas = document.getElementById("background");
        this.backgroundContext = this.backgroundCanvas.getContext("2d", {
            alpha: false
        });

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
        Game.handleMobile();
    }

    static handleMobile() {
        var check = false;
        (function(a) {
            if (
                /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
                    a
                ) ||
                /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                    a.substr(0, 4)
                )
            )
                check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);

        if (check) {
            Game.instance.backgroundCanvas.width = window.innerWidth;
            Game.instance.backgroundCanvas.height = window.innerHeight;

            window.addEventListener("touchstart", () => {
                if (!Game.isGameOver) {
                    Game.boid.jump();
                    Game.pipeGenerator.start();
                    Game.isPipesComing = true;
                } else {
                    Game.reset();
                    Game.start();
                }
            });
        }
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
            Game.backgroundContext.fillStyle = "skyblue";
            Game.backgroundContext.fillRect(0, 0, gameWidth, gameHeight);
            Game.backgroundContext.fillStyle = "brown";
            Game.backgroundContext.fillRect(
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
        Game.uiContext.clearRect(gameWidth / 4, 25, gameWidth / 2, 50);
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

    static get backgroundContext() {
        return Game.instance.backgroundContext;
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
