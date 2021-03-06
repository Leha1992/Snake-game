class Field {
  constructor(options) {
    this.options = options;
    this.element = this.options.element;
    this.score = 0;
  }

  renderField() {
    document.querySelector('.score').textContent = 'Score: ' + this.score;
    this.element.style.width =
      this.options.cellWidth * this.options.sizeX + 'px';
    this.element.style.height =
      this.options.cellHeight * this.options.sizeY + 'px';
    for (let i = 0; i <= this.options.sizeX; i++) {
      for (let innerIndex = 0; innerIndex <= this.options.sizeY; innerIndex++) {
        let cell = document.createElement('div');
        cell.className = 'cell';
        cell.style.width = this.options.cellWidth + 'px';
        cell.style.height = this.options.cellHeight + 'px';
        this.element.appendChild(cell);
      }
    }
  }
}

// snake class
class Snake {
  constructor(options) {
    this.options = options;
    this.snakeItems = [];
    this.isDelay = true;
  }

  initSnake() {
    this.renderSnake();
    this.moveFunction();
    this.chageDirection();
    this.chageDirection();
  }

  renderSnake() {
    let length = this.options.snake.defaultSize;
    let randomPositionY = Math.floor(Math.random() * field.options.sizeY);
    for (let i = 0; i < length; i++) {
      let snakeItem = document.createElement('div');
      snakeItem.className = 'snake-item';
      snakeItem.style.width = this.options.snake.widthItem + 'px';
      snakeItem.style.height = this.options.snake.heightItem + 'px';
      snakeItem.style.top =
        randomPositionY * this.options.snake.widthItem + 1 + 'px';
      snakeItem.style.left = i * this.options.snake.widthItem + 'px';

      this.snakeItems.push({
        element: snakeItem,
        positionX: i,
        positionY: randomPositionY,
        direction: this.options.directionDefault
      });

      field.element.appendChild(snakeItem);
    }
  }

  chageDirection() {
    document.addEventListener('keydown', e => {
      let head = this.snakeItems[this.snakeItems.length - 1];
      for (let i = 0; i < this.snakeItems.length; i++) {
        switch (e.keyCode) {
          case 40:
            if (this.isDelay) {
              if (head.direction !== 'top') head.direction = 'bottom';
              this.isDelay = false;
              setTimeout(() => {
                this.isDelay = true;
              }, this.options.speed);
            }

            break;
          case 39:
            if (this.isDelay) {
              if (head.direction !== 'left') head.direction = 'right';
              this.isDelay = false;
              setTimeout(() => {
                this.isDelay = true;
              }, this.options.speed);
            }

            break;
          case 38:
            if (this.isDelay) {
              if (head.direction !== 'bottom') head.direction = 'top';
              this.isDelay = false;
              setTimeout(() => {
                this.isDelay = true;
              }, this.options.speed);
            }
            break;
          case 37:
            if (this.isDelay) {
              if (head.direction !== 'right') head.direction = 'left';
              this.isDelay = false;
              setTimeout(() => {
                this.isDelay = true;
              }, this.options.speed);
            }
            break;
          default:
        }
      }
    });
  }

  addTail() {
    let tail = document.createElement('div');
    tail.className = 'snake-item';
    tail.style.width = this.options.snake.widthItem + 'px';
    tail.style.height = this.options.snake.heightItem + 'px';
    tail.style.top = this.snakeItems[0].element.style.top;
    tail.style.left = this.snakeItems[0].element.style.left;

    this.snakeItems.unshift({
      element: tail,
      direction: this.snakeItems[0].direction,
      positionX:
        this.snakeItems[0].direction === 'right'
          ? this.snakeItems[0].positionX - 1
          : this.snakeItems[0].direction === 'left'
            ? this.snakeItems[0].positionX + 1
            : this.snakeItems[0].positionX,
      positionY:
        this.snakeItems[0].direction === 'top'
          ? this.snakeItems[0].positionY + 1
          : this.snakeItems[0].direction === 'bottom'
            ? this.snakeItems[0].positionY - 1
            : this.snakeItems[0].positionY
    });

    field.element.appendChild(tail);
  }

  eat() {
    let head = this.snakeItems[this.snakeItems.length - 1].element;
    let foodItem = document.querySelector('.food');

    if (foodItem) {
      if (
        head.style.left === foodItem.style.left &&
        head.style.top === foodItem.style.top
      ) {
        document.querySelector('.score').textContent =
          'Score: ' + ++field.score;
        foodItem.remove();
        this.addTail();
        food.renderFood();
        if (this.options.speed <= 200 && this.options.speed > 100) {
          this.options.speed = this.options.speed - 3;
        } else if (this.options.speed > 50 && this.options.speed <= 100) {
          this.options.speed = this.options.speed - 1;
        }
      }
    }
  }

  move() {
    this.eat();
    for (let i = 0; i < this.snakeItems.length; i++) {
      switch (this.snakeItems[i].direction) {
        case 'right':
          this.snakeItems[i].positionX++;
          this.snakeItems[i].element.style.left =
            this.snakeItems[i].positionX * this.options.snake.widthItem + 'px';
          break;
        case 'left':
          this.snakeItems[i].positionX--;
          this.snakeItems[i].element.style.left =
            this.snakeItems[i].positionX * this.options.snake.widthItem + 'px';
          break;
        case 'bottom':
          this.snakeItems[i].positionY++;
          this.snakeItems[i].element.style.top =
            this.snakeItems[i].positionY * this.options.snake.widthItem + 'px';
          break;
        case 'top':
          this.snakeItems[i].positionY--;
          this.snakeItems[i].element.style.top =
            this.snakeItems[i].positionY * this.options.snake.widthItem + 'px';
          break;
        default:
          throw new Error('No such direction');
      }
    }

    for (let i = 0; i < this.snakeItems.length - 1; i++) {
      this.snakeItems[i].direction = this.snakeItems[i + 1].direction;
    }
  }

  checkEndGame() {
    let headSnake = this.snakeItems[this.snakeItems.length - 1];

    if (
      headSnake.positionX === field.options.cellWidth ||
      headSnake.positionX < 0 ||
      headSnake.positionY === field.options.cellHeight ||
      headSnake.positionY < 0
    ) {
      return true;
    }

    for (let i = 0; i < this.snakeItems.length - 1; i++) {
      if (
        headSnake.element.style.left ===
          this.snakeItems[i].element.style.left &&
        headSnake.element.style.top === this.snakeItems[i].element.style.top
      ) {
        return true;
      }
    }

    return false;
  }

  moveFunction() {
    if (!this.checkEndGame()) {
      this.move();
      setTimeout(() => {
        if (restartGame) {
          return;
        }
        this.moveFunction();
      }, this.options.speed);
    } else {
      alert('Game Over!');
    }
  }
}

//food class
class Food {
  constructor(options) {
    this.options = options;
  }

  renderFood() {
    let randomX =
      Math.floor(Math.random() * field.options.sizeX) * field.options.cellWidth;
    let randomY =
      Math.floor(Math.random() * field.options.sizeY) *
      field.options.cellHeight;
    let foodItem = document.createElement('div');
    foodItem.className = 'food';
    foodItem.style.width = this.options.foodWidth + 'px';
    foodItem.style.height = this.options.foodHeight + 'px';
    foodItem.style.left = randomX + 'px';
    foodItem.style.top = randomY + 'px';

    for (let i = 0; i < snake.snakeItems.length; i++) {
      if (
        snake.snakeItems[i].element.style.left === foodItem.style.left &&
        snake.snakeItems[i].element.style.top === foodItem.style.top
      ) {
        this.renderFood();
        return;
      }
    }
    field.element.appendChild(foodItem);
  }
}

let field = new Field({
  sizeX: 20,
  sizeY: 20,
  cellWidth: 20,
  cellHeight: 20,
  element: document.getElementById('container')
});

let snake = new Snake({
  snake: {
    defaultSize: 3,
    widthItem: 20,
    heightItem: 20
  },
  directionDefault: 'right'
});

let food = new Food({
  foodWidth: 20,
  foodHeight: 20
});

window.onload = () => {
  field.renderField();
  document.querySelector('.new-game').addEventListener('click', () => {
    restartGame = true;
    setTimeout(() => {
      document.getElementById('container').innerHTML = '';
      document.querySelector('.score').innerHTML = '';
      snake.snakeItems = [];
      field.score = 0;
      snake.options.speed = 200;
      field.renderField();
      snake.initSnake();
      food.renderFood();
      restartGame = false;
    }, 150);
  });
};
