"use strict";

let gameTool = {
    ball: null,
    paddle: null,
    ballOnPaddle: true,
    fx: null
};

let textInfo = {
    scoreText: "",
    score: 0,
    introText: "",
    winText: ""
};

//ф-ция создания платформы (ракетка)
function createPaddle(x, y) {
    let paddle = game.add.sprite(x, y, "paddle");
    paddle.anchor.setTo(0.5, 0.5);

    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.collideWorldBounds = true;

    paddle.body.bounce.set(1);
    paddle.body.immovable = true;

    return paddle;
};

// ф-ция создания мяча
function createBall(x, y) {
    let ball = game.add.sprite(x, y, "ball");
    ball.anchor.set(0.5);
    ball.checkWorldBounds = true;

    game.physics.enable(ball, Phaser.Physics.ARCADE);

    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    ball.events.onOutOfBounds.add(ballLost, this);
    game.input.onDown.add(releaseBall, this);

    return ball;
};
// ф- ция создания аудио
function createAudio(sfx) {
    let fx = game.add.audio(sfx);
    fx.allowMultiple = true;
    fx.addMarker("numkey", 9, 0.1);
    fx.addMarker("escape", 4, 3.2);
    fx.addMarker("death", 12, 4.2);
    return fx;
};

// создание текстовых полей 
function createtTextInfo() {
    textInfo.scoreText = game.add.text(32, 550, 'score: 0', { font: "20px Arial", fill: "#696969", align: "left" });
    textInfo.introText = game.add.text(game.world.centerX, 300, 'Click to START', { font: "40px Arial", fill: "#FFA07A", align: "center" });
    textInfo.introText.anchor.setTo(0.5, 0.5);

    textInfo.winText = game.add.text(game.world.centerX, 200, ' You WIN ', { font: "40px Arial", fill: "#FFD700", align: "center" });
    textInfo.winText.anchor.setTo(0.5, 0.5);
    textInfo.winText.visible = false;
};

// начальные настройки мяча
function releaseBall() {
    if (gameTool.ballOnPaddle) {
        gameTool.ballOnPaddle = false;
        // начальная скорость и вектор направления мяча
        gameTool.ball.body.velocity.y = -300;
        gameTool.ball.body.velocity.x = -30;
        textInfo.introText.visible = false;
        textInfo.winText.visible = false;
    }
};

function checkWin() {
    if (textInfo.score === 1005) {
        textInfo.winText.visible = true;
        ballLost();
    }
};

function ballLost() {
    gameOver();
    gameTool.ballOnPaddle = true;
    gameTool.ball.reset(gameTool.paddle.body.x + 16, gameTool.paddle.y - 12);
};

function gameOver() {
    gameTool.fx.play("death");

    gameTool.ball.body.velocity.setTo(0, 0);
    textInfo.introText.text = 'Game Over!';
    textInfo.introText.visible = true;
    textInfo.score = 0;
    textInfo.scoreText.text = 'score: ' + textInfo.score;
};

function checkSpeed() {

    if (textInfo.score % 20 === 0) {
        gameTool.ball.body.velocity.y -= 20;
        gameTool.fx.play("escape");
    } else if (gameTool.ball.body.velocity.y === -1000) {
        gameTool.ball.body.velocity.y = -1000;
    }
};

// отбивания мяча от ракетки
function ballHitPaddle(ball, paddle) {
    gameTool.fx.play("numkey");
    textInfo.score += 5;
    textInfo.scoreText.text = 'score: ' + textInfo.score;

    checkSpeed();
    let diff = 0;

    if (ball.x < paddle.x) {
        diff = paddle.x - ball.x;
        ball.body.velocity.x = (-10 * diff);
    }
    else if (ball.x > paddle.x) {
        diff = ball.x - paddle.x;
        ball.body.velocity.x = (10 * diff);
    }
    else {
        ball.body.velocity.x = 2 + Math.random() * 8;
    }
};
