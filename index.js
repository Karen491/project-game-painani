const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let frames = 0;
let requestId;
let obstacles = [];
let rewards = [];
let points = 0;
let winningScore = 270;

var kilometers = document.getElementById("kilometers");

let sprites = {
  running: {
    src: "./images/painani-runner-duplicate.png",
    width: 250,
    height: 500
  }
};

class Painani {
  constructor(x, y, width, height) {
    this.image = new Image();
    this.image.src = sprites.running.src;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sx = 0;
    this.sy = 0;
    this.sw = sprites.running.width;
    this.sh = sprites.running.height;
  }

  collision(item) {
    return (
      this.x < item.x + item.width &&
      this.x + this.width > item.x &&
      this.y < item.y + item.height &&
      this.y + this.height > item.y
    );
  }

  draw() {
    if (this.sx > 250) this.sx = 0;
    ctx.drawImage(
      this.image,
      this.sx,
      this.sy,
      this.sw,
      this.sh,
      this.x,
      this.y,
      this.width,
      this.height
    );
    if (frames % 15 === 0) this.sx += 250;
  }
}

class Background {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = canvas.width;
    this.height = canvas.height;
    this.image = new Image();
    this.image.src = "images/Painani path extendido.jpg";
  }

  draw() {
    this.y++;
    if (this.y > canvas.height) this.y = 0;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.x,
      this.y - canvas.height,
      this.width,
      this.height
    );
  }
}

class Obstacle {
  constructor(x) {
    this.x = x;
    this.y = 0;
    this.width = 140;
    this.height = 120;
    this.image = new Image();
    this.image.src = "./images/painani-obstacle-removebg-preview.png";
  }

  draw() {
    if (frames % 10) this.y += 6;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Reward {
  constructor(x) {
    this.x = x;
    this.y = 0;
    this.width = 60;
    this.height = 40;
    this.image = new Image();
    this.image.src = "./images/fish-removebg-preview.png";
  }

  draw() {
    if (frames % 10) this.y += 5;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

const background = new Background();
const obstacle = new Obstacle();
const painani = new Painani(450, 720, 120, 170);
const reward = new Reward();

function generateObstacles() {
  if (frames % 100 == 0) {
    const x = Math.floor(Math.random() * 500 + 200);
    const obstacle = new Obstacle(x);
    obstacles = [...obstacles, obstacle];
  }
}

function drawingObstacles() {
  obstacles.forEach((obstacle, index) => {
    if (obstacle.y > 900) {
      return obstacles.splice(index, 1);
    }
    obstacle.draw();
    if (painani.collision(obstacle)) {
      requestId = undefined;
    }
  });
}

function generateRewards() {
  if (frames % 50 == 0) {
    const x = Math.floor(Math.random() * 500 + 200);
    const reward = new Reward(x);
    rewards = [...rewards, reward];
  }
}

function drawingRewards() {
  rewards.forEach((reward, index) => {
    if (reward.y > 900) {
      return rewards.splice(index, 1);
    }
    reward.draw();
    if (painani.collision(reward)) {
      points += 10;
      ctx.font = "50px Avenir";
      ctx.fillText("+ 10", reward.x + 65, reward.y + 5);
      rewards.splice(index, 1);
      kilometers.textContent = points;
    }
  });
}

function gameOver() {
  requestId = undefined;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  ctx.font = "80px 'Bellota Text', cursive";
  ctx.fillText("You failed!!", 300, 200);
  const image = new Image();
  image.src = "./images/loss-image-removebg-preview.png";
  image.addEventListener(
    "load",
    () => {
      ctx.drawImage(image, 80, 220, 800, 400);
    },
    false
  );
}

function winGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  ctx.font = "80px 'Bellota Text', cursive";
  ctx.fillText("Mission accomplished!!", 100, 200);
  const image = new Image();
  image.src = "./images/win-image-removebg-preview.png";
  image.addEventListener(
    "load",
    () => {
      ctx.drawImage(image, 80, 220, 800, 400);
    },
    false
  );
}

function update() {
  frames++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  background.draw();
  painani.draw();
  generateObstacles();
  drawingObstacles();
  generateRewards();
  drawingRewards();
  if (points === winningScore) {
    winGame();
    requestId = undefined;
  }
  if (!requestId && points < winningScore) gameOver();
  if (requestId) {
    requestId = requestAnimationFrame(update);
  }
}

window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    startGame();
  };

  function startGame() {
    requestId = requestAnimationFrame(update);
  }
};

addEventListener("keydown", e => {
  if (e.keyCode === 39) {
    if (painani.x <= 699) {
      painani.x += 50;
    }
  }
  if (e.keyCode === 37) {
    if (painani.x >= 200) {
      painani.x -= 50;
    }
  }
});
