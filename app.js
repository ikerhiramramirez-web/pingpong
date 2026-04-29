const ball = document.querySelector(".ball");
const paddleLeft = document.querySelector(".caja-container .caja");
const paddleRight = document.querySelector("#caja_dos .caja");

const game = document.querySelector(".game");
const ball = document.querySelector(".ball");

let ballX;
let ballY;

let speedX = 3;
let speedY = 3;

let ballX = game.clientWidth / 2 - 10;
let ballY = game.clientHeight / 2 - 10;


function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();


function update() {
    ballX += speedX;
    ballY += speedY;

    const gameWidth = game.clientWidth;
    const gameHeight = game.clientHeight;

    const ballSize = 20;

    // rebote arriba/abajo
    if (ballY <= 0 || ballY >= gameHeight - ballSize) {
        speedY *= -1;
    }

    // rebote izquierda/derecha
    if (ballX <= 0 || ballX >= gameWidth - ballSize) {
        speedX *= -1;
    }
}

 function render() {
    ball.style.transform = `translate(${ballX}px, ${ballY}px)`;
}

console.log(ballX, ballY);