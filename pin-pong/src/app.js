"use strict";

let gameContainer = document.getElementById("game");
const game = new Phaser.Game(800, 600, Phaser.AUTO, gameContainer, {
    preload: preload,
    create: create,
    update: update
});

function preload() {
    game.load.image("background", "assets/img/diamond.png");
    game.load.image("paddle", "assets/img/paddle.png");
    game.load.image("ball", "assets/img/ball.png");
    game.load.audio("sfx", "assets/SoundEffects/fx_mixdown.ogg");
};

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // проверка столкновения мяча со стенами (кроме нижней стены)
    game.physics.arcade.checkCollision.down = false;

    game.add.tileSprite(0, 0, 800, 600, "background");
    gameTool.fx = createAudio("sfx");

    gameTool.paddle = createPaddle(game.world.centerX, 500);
    gameTool.ball = createBall(game.world.centerX, gameTool.paddle.y - 12);
    createtTextInfo();
};

function update() {
    gameTool.paddle.x = game.input.x;

    if (gameTool.paddle.x < 24) {
        gameTool.paddle.x = 24;
    } else if (gameTool.paddle.x > game.width - 24) {
        gameTool.paddle.x = game.width - 24;
    }

    if (gameTool.ballOnPaddle) {
        gameTool.ball.body.x = gameTool.paddle.x - 5;
    } else {
        //реализация отбивания мяча от платформы (ракетки)
        game.physics.arcade.collide(gameTool.ball, gameTool.paddle, ballHitPaddle, null, this);
        // проверка на окончание игры по достижению максиального количества очков
        checkWin();
    }
};

