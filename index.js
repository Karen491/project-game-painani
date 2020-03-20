const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let frames = 0;
let requestId;
let warrios = [];
let rewards = [];

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
    this.image.src = "./images/Painani path extendido.jpg";
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

class Warrior {
  constructor(x) {
    this.x = x;
    this.y = 0;
    this.width = 80;
    this.height = 80;
    this.image = new Image();
    this.image.src = "./images/aztec-warrior.png";
  }

  draw() {
    if (frames % 5) this.y += 6;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Reward {
  constructor(x) {
    this.x = x;
    this.y = 0;
    this.width = 30;
    this.height = 30;
    this.image = new Image();
    this.image.src = "./images/drop-it-clipart-4-removebg-preview.png";
  }

  draw() {
    if (frames % 5) this.y += 0.5;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

const background = new Background();
const warrior = new Warrior();
const painani = new Painani(300, 720, 120, 170);
const reward = new Reward();

function generateWarrios() {
  if (frames % 100 == 0) {
    const x = Math.floor(Math.random() * 400 + 250);
    const warrior = new Warrior(x);
    warrios = [...warrios, warrior];
  }
}

function drawingWarriors() {
  warrios.forEach((warrior, index) => {
    if (warrior.y > 900) {
      return warrios.splice(index, 1);
    }
    warrior.draw();
    if (painani.collision(warrior)) {
      requestId = undefined;
    }
  });
}

function generateRewards() {
  if (frames % 200 == 0) {
    const x = Math.floor(Math.random() * 400 + 250);
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
    // if (painani.collision(warrior)) {
    //   requestId = undefined;
    // }
  });
}

function gameOver() {
  requestId = undefined;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "80px Avenir";
  ctx.fillText("Game Over", 250, 500);
}

function update() {
  frames++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  background.draw();
  painani.draw();
  generateWarrios();
  drawingWarriors();
  // drawingDrops();
  if (!requestId) gameOver();
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
    if (painani.x <= 550) {
      painani.x += 50;
    }
  }
  if (e.keyCode === 37) {
    if (painani.x >= 200) {
      painani.x -= 50;
    }
  }
});
