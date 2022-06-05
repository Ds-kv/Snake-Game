let lastRenderTime = 0;
let SPEED = 5;
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const BLOCK_SIZE = 30;
const WIDTH = BLOCK_SIZE * 20;
const HEIGHT = BLOCK_SIZE * 20;

let Score = 0;

class Rect {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
  }
}
// directions
const RIGHT = 0;
const LEFT = 1;
const UP = 2;
const DOWN = 3;
const SNAKE_COLOR = "red";
const FOOD_COLOR = "green";

prepare();
window.requestAnimationFrame(main);

function random(max) {
  return Math.floor(Math.random() * (max - 0 + 1) + 0);
}

function main(crntTime) {
  window.requestAnimationFrame(main);
  const secSinceLastRender = (crntTime - lastRenderTime) / 1000;
  if (secSinceLastRender < 1 / SPEED) return;

  update();
  lastRenderTime = crntTime;
}


function prepare() {
  document.querySelector("body").appendChild(canvas);
  canvas.classList.add("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  document.addEventListener("keydown", handle_keys);
}

class Snake {
  constructor() {
    this.head = new Rect(WIDTH / 2, HEIGHT / 2, SNAKE_COLOR);
    this.snake = [
      this.head,
      new Rect(this.head.x - BLOCK_SIZE, this.head.y, SNAKE_COLOR),
    ];
    this.direction = DOWN;
    this.food = null;
    this.food_();
  }

  food_() {
    let x =
      (random(Math.floor((canvas.width - BLOCK_SIZE) / BLOCK_SIZE)) * BLOCK_SIZE);
    let y =
      (random(Math.floor((canvas.height - BLOCK_SIZE) / BLOCK_SIZE)) * BLOCK_SIZE);
    //if (x + BLOCK_SIZE > canvas.width || x - BLOCK_SIZE < 0) this.food_();
    //if (y + BLOCK_SIZE > canvas.height || y - BLOCK_SIZE < 0) this.food_();
    this.food = new Rect(x, y, FOOD_COLOR);
    console.log(this.food);
  }

  draw() {
    for (let i = 0; i < this.snake.length; i++) {
      this.snake[i].draw(ctx);
    }
    this.food.draw(ctx);
  }

  move() {
    if (this.check_collision()) return;
    let x = this.head.x;
    let y = this.head.y;

    switch (this.direction) {
      case RIGHT:
        x += BLOCK_SIZE;
        break;
      case LEFT:
        x -= BLOCK_SIZE;
        break;
      case UP:
        y -= BLOCK_SIZE;
        break;
      case DOWN:
        y += BLOCK_SIZE;
        break;
      default:
        break;
    }

    this.head = new Rect(x, y, SNAKE_COLOR);
    this.snake.unshift(this.head);
    if (this.head.x == this.food.x && this.head.y == this.food.y) {
      this.food_();
      Score += 1;
    } else {
      this.snake.pop();
    }
  }

  check_collision() {
    if (
      this.head.x + BLOCK_SIZE > WIDTH ||
      this.head.x + BLOCK_SIZE < 0 ||
      this.head.y + BLOCK_SIZE > HEIGHT ||
      this.head.y + BLOCK_SIZE < 0
    ) {
      return true;
    }

    for (let i = 0; i < snake.snake.length; i++) {
      const x = snake.snake[i];
      if (x.x == snake.head.x && x.y == snake.head.y && i != 0) {
        return true;
      }
    }

    return false;
  }
}

let snake = new Snake();

function handle_keys(e) {
  switch (e.key) {
    case "ArrowUp":
      if (snake.direction == DOWN) return;
      snake.direction = UP;
      break;
    case "ArrowDown":
      if (snake.direction == UP) return;
      snake.direction = DOWN;
      break;
    case "ArrowLeft":
      if (snake.direction == RIGHT) return;
      snake.direction = LEFT;
      break;
    case "ArrowRight":
      if (snake.direction == LEFT) return;
      snake.direction = RIGHT;
      break;
    default:
      break;
  }
}

function update() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "#000022";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  snake.move();
  if (snake.check_collision() == true) {
    Score = 0;
    snake = new Snake();
  }
  draw();
}

function draw() {
  snake.draw();
  ctx.font = "30px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`Score: ${Score}`, 10, 50, 500);
}
