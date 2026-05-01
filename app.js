const ball = document.querySelector(".ball");
const paddleLeft = document.querySelector(".caja-container .caja");
const paddleRight = document.querySelector("#caja_dos .caja");

const game = document.querySelector(".game");

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

    const ballRect = ball.getBoundingClientRect();
    const leftRect = paddleLeft.getBoundingClientRect();
    const rightRect = paddleRight.getBoundingClientRect();

    if (isColliding(ballRect, leftRect)) {
    ballX = leftRect.right;
    speedX = Math.abs(speedX);
}

    if (isColliding(ballRect, rightRect)) {
    ballX = rightRect.left - 20;
    speedX = -Math.abs(speedX);
}

console.log(isColliding(ballRect, leftRect));

}

 function render() {
    ball.style.transform = `translate(${ballX}px, ${ballY}px)`;
}

console.log(ballX, ballY);

function isColliding(a, b) {
    return (
        a.left < b.right &&
        a.right > b.left &&
        a.top < b.bottom &&
        a.bottom > b.top
    );
}

if (isColliding(ballRect, leftRect)) {
    ballX = leftRect.right;
    speedX = Math.abs(speedX);
}

if (isColliding(ballRect, rightRect)) {
    ballX = rightRect.left - 20;
    speedX = -Math.abs(speedX);
}

const hitPoint = (ballRect.top - leftRect.top) / leftRect.height;
speedY = (hitPoint - 0.5) * 10;