let paddle1 = document.getElementById("paddle1");
let paddle2 = document.getElementById("paddle2");
let ballDiv = document.getElementById("ball");
let scoreDiv = document.getElementById("score");
let restartBtn = document.getElementById("restart");

const boardWidth = 500;
const boardHeight = 500;
let paddleLeft;
let paddleRight;
let paddleLeftIntervalID;
let paddleRightIntervalID;
let ballIntervalID;
let paddleSpeed = 10;
let ball;
let ballSpeed = 1.5;
const ballSpeedIncrement = 0.5;
const ballRadius = 10;
let paddleWidth = 30;
let paddleHeight = 110;
let leftScore = 0;
let rightScore = 0;

window.addEventListener("keydown", movePaddle);
window.addEventListener("keyup", stopPaddle);
restartBtn.addEventListener("click", restartGame);

class Paddle {
  constructor(paddle, left, right) {
    this.speed = paddleSpeed;
    this.paddleWidth = 30;
    this.paddleHeight = 110;
    this.paddle = paddle;
    this.upIntervalID;
    this.downIntervalID;
    this.left = left;
    this.right = right;
    this.top = boardHeight / 2 - paddleHeight / 2;
    this.draw();
  }

  moveUp() {
    this.upIntervalID = setInterval(() => {
      if (this.top > 0) {
        this.top -= this.speed;
        this.draw();
      } else {
        this.stopUp();
      }
    }, 10);
  }

  moveDown() {
    this.downIntervalID = setInterval(() => {
      if (this.top + paddleHeight < boardHeight) {
        this.top += this.speed;
        this.draw();
      } else {
        this.stopDown();
      }
    }, 10);
  }

  draw() {
    this.paddle.style.top = this.top + "px";
    this.paddle.style.left = this.left;
    this.paddle.style.right = this.right;
  }

  stopDown() {
    clearInterval(this.downIntervalID);
  }

  stopUp() {
    clearInterval(this.upIntervalID);
  }
}

startGame();

function startGame() {
  paddleLeft = new Paddle(paddle1, "0", undefined);
  paddleRight = new Paddle(paddle2, undefined, "0");
  ball = {
    top: boardHeight / 2 - ballRadius,
    left: boardWidth / 2 - ballRadius,
    speedX: Math.floor(Math.random() * 2) == 1 ? ballSpeed : -1 * ballSpeed,
    speedY: Math.floor(Math.random(2) * 2) == 1 ? ballSpeed : -1 * ballSpeed,
  };
  drawBall();
  setScore();
  ballIntervalID = setInterval(() => {
    checkBallCollision();
    checkPaddleCollision();
    moveBall();
    drawBall();
  }, 10);
}

function moveBall() {
  ball.top += ball.speedY;
  ball.left += ball.speedX;
}
function drawBall() {
  ballDiv.style.top = ball.top + "px";
  ballDiv.style.left = ball.left + "px";
}

function checkPaddleCollision() {
  if (
    ball.left < paddleWidth &&
    ball.left > paddleWidth - ballRadius && //this allows for some contact with paddle once ball has passed it slightly
    ball.top > paddleLeft.top - 2 * ballRadius &&
    ball.top < paddleLeft.top + paddleHeight
  ) {
    ball.speedX = Math.abs(ball.speedX) + ballSpeedIncrement;
    ball.speedY +=
      ball.speedY > 0 ? ballSpeedIncrement : -1 * ballSpeedIncrement;
  }

  if (
    ball.left + 2 * ballRadius > boardWidth - paddleWidth &&
    ball.left + 2 * ballRadius < boardWidth - paddleWidth + ballRadius &&
    ball.top > paddleRight.top - 2 * ballRadius &&
    ball.top < paddleRight.top + paddleHeight
  ) {
    ball.speedX = -1 * (Math.abs(ball.speedX) + ballSpeedIncrement);
    ball.speedY +=
      ball.speedY > 0 ? ballSpeedIncrement : -1 * ballSpeedIncrement;
  }
}

function checkBallCollision() {
  if (ball.top <= 0 || ball.top >= boardHeight - ballRadius * 2)
    ball.speedY *= -1;

  if (ball.left < 0 || ball.left > boardWidth - 2 * ballRadius) {
    ballDiv.style.visibility = "hidden";
    clearInterval(ballIntervalID);
    ball.left < paddleWidth ? rightScore++ : leftScore++;
    scoreDiv.innerHTML = leftScore + " : " + rightScore;
  }
}

function setScore() {
  scoreDiv.innerHTML = leftScore + " : " + rightScore;
}

function movePaddle(event) {
  switch (true) {
    case event.key === "p" && !event.repeat:
      paddleRight.stopDown();
      paddleRight.moveUp();
      break;
    case event.key === "l" && !event.repeat:
      paddleRight.stopUp();
      paddleRight.moveDown();
      break;
    case event.key === "q" && !event.repeat:
      paddleLeft.stopDown();
      paddleLeft.moveUp();
      break;
    case event.key === "a" && !event.repeat:
      paddleLeft.stopUp();
      paddleLeft.moveDown();
      break;
  }
}

function stopPaddle(event) {
  switch (event.key) {
    case "p":
      paddleRight.stopUp();
      break;
    case "l":
      paddleRight.stopDown();
      break;
    case "q":
      paddleLeft.stopUp();
      break;
    case "a":
      paddleLeft.stopDown();
      break;
  }
}

function restartGame() {
  ballDiv.style.visibility = "visible";
  clearInterval(ballIntervalID);
  startGame();
}
