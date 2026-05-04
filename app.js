const ball = document.querySelector(".ball");
const paddleLeft = document.querySelector(".caja-container .caja");
const paddleRight = document.querySelector("#caja_dos .caja");

const game = document.querySelector(".game");
const paddleSpeed = 5;

const startButton = document.querySelector("#caja_boton");

const keys = {};
window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

let scoreLeft = 0;
let scoreRight = 0;
const maxScore = 3;
const leftScoreEl = document.querySelector("#leftScore");
const rightScoreEl = document.querySelector("#rightScore");

let timeLeft = 180; // 3 minutos en segundos
let timerInterval = null;
const timerEl = document.querySelector("#timer");
let speedBoostActivated = false;
let gameRunning = false;

let speedX = 3;
let speedY = 3;

let ballX = game.clientWidth / 2 - 10;
let ballY = game.clientHeight / 2 - 10;

resetBall();
render();
setInitialPaddlePosition();


function gameLoop() {
    if (!gameRunning) return;

    update();
    render();
    requestAnimationFrame(gameLoop);
}

function update() {
    // mover bola
    ballX += speedX;
    ballY += speedY;

    const gameWidth = game.clientWidth;
    const gameHeight = game.clientHeight;
    const ballSize = 20;

    // rebote arriba/abajo
    if (ballY <= 0 || ballY >= gameHeight - ballSize) {
        speedY *= -1;
    }

    // puntos (NO rebote en lados)
    if (ballX <= 0) {
        scoreRight++;
        resetBall();
        return; // importante para evitar conflictos
    }

    if (ballX >= gameWidth - ballSize) {
        scoreLeft++;
        resetBall();
        return; // importante
    }

    // colisiones con paletas
    const ballRect = ball.getBoundingClientRect();
    const leftRect = paddleLeft.getBoundingClientRect();
    const rightRect = paddleRight.getBoundingClientRect();

    // colision izquierda
    if (
    speedX < 0 &&
    ballX <= leftRect.right &&
    ballX + 20 >= leftRect.left &&
    ballY + 20 >= leftRect.top &&
    ballY <= leftRect.bottom
    ) {
    ballX = leftRect.right;
    speedX *= -1;
    }

    // colision derecha
    if (
    speedX > 0 &&
    ballX + 20 >= rightRect.left &&
    ballX <= rightRect.right &&
    ballY + 20 >= rightRect.top &&
    ballY <= rightRect.bottom
    ) {
    ballX = rightRect.left - 20;
    speedX *= -1;
    }

    // movimiento de paletas
    let leftY = paddleLeft.offsetTop;
    let rightY = paddleRight.offsetTop;

    if (keys["w"]) leftY -= paddleSpeed;
    if (keys["s"]) leftY += paddleSpeed;

    if (keys["ArrowUp"]) rightY -= paddleSpeed;
    if (keys["ArrowDown"]) rightY += paddleSpeed;

    // límites
    leftY = Math.max(0, Math.min(gameHeight - paddleLeft.offsetHeight, leftY));
    rightY = Math.max(0, Math.min(gameHeight - paddleRight.offsetHeight, rightY));

    // aplicar movimiento
    paddleLeft.style.top = leftY + "px";
    paddleRight.style.top = rightY + "px";
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

function resetBall() {
    ballX = game.clientWidth / 2 - 10;
    ballY = game.clientHeight / 2 - 10;

    speedX *= -1; // cambia dirección
    speedY = 3 * (Math.random() > 0.5 ? 1 : -1);

    updateScore();
    checkWinner();
}

function updateScore() {
    leftScoreEl.textContent = scoreLeft;
    rightScoreEl.textContent = scoreRight;
}

function checkWinner() {
    if (scoreLeft === maxScore) {
        alert("Gana izquierda");
        resetGame();
    }

    if (scoreRight === maxScore) {
        alert("Gana derecha");
        resetGame();
    }
}

function resetGame() {
    scoreLeft = 0;
    scoreRight = 0;
    updateScore();

    timeLeft = 180;
    timerEl.textContent = "03:00";

    clearInterval(timerInterval);

    speedX = 3;
    speedY = 3;
    speedBoostActivated = false;
    ball.style.background = "white";

    document.getElementById("caja_boton").style.display = "flex";
    startButton.disabled = false;
    gameRunning = false;

    paddleLeft.style.top = initialLeftY + "px";
    paddleRight.style.top = initialRightY + "px";
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;

        timerEl.textContent = formatTime(timeLeft);

        // activar velocidad extra y color en el último minuto
        if (timeLeft <= 60 && !speedBoostActivated) {
            speedX *= 2;
            speedY *= 2;
            speedBoostActivated = true;

            ball.style.background = "red";
        }

        // cuando el tiempo llega a 0
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGameByTime();
        }

    }, 1000);
}

function endGameByTime() {
    if (scoreLeft > scoreRight) {
        alert("Gana izquierda por tiempo");
    } else if (scoreRight > scoreLeft) {
        alert("Gana derecha por tiempo");
    } else {
        alert("Empate");
    }
    resetGame();
    gameRunning = false;

}

function startGame() {
    if (gameRunning) return; // evita duplicados

    gameRunning = true;

    startButton.disabled = true;
    document.getElementById("caja_boton").style.display = "flex";

    resetBall();

    gameLoop();
    startTimer();

    ball.style.background = "white";
}

    startButton.addEventListener("click", startGame);

    function setInitialPaddlePosition() {
    const gameHeight = game.clientHeight;

    initialLeftY = gameHeight / 2 - paddleLeft.offsetHeight / 2;
    initialRightY = gameHeight / 2 - paddleRight.offsetHeight / 2;

    paddleLeft.style.top = initialLeftY + "px";
    paddleRight.style.top = initialRightY + "px";
}
