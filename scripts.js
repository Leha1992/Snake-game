class Field {
  constructor(options) {
    this.options = options;
    this.element = this.options.element;
  }

  renderField() {
    this.element.style.width =
      this.options.cellWidth * this.options.sizeX + 'px';
    this.element.style.height =
      this.options.cellHeight * this.options.sizeY + 'px';
  }
}

const field = new Field({
  sizeX: 20,
  sizeY: 20,
  cellWidth: 20,
  cellHeight: 20,
  element: document.getElementById('container')
});

field.renderField();

//food class

class Food {
  constructor(options) {
    this.options = options;
  }

  renderFood() {
    let foodItem = document.createElement('div');
    foodItem.className = 'food';
    foodItem.style.width = this.options.foodWidth + 'px';
    foodItem.style.height = this.options.foodHeight + 'px';
    foodItem.style.left =
      Math.floor(Math.random() * field.options.sizeX) *
        field.options.cellWidth +
      'px';
    foodItem.style.top =
      Math.floor(Math.random() * field.options.sizeY) *
        field.options.cellHeight +
      'px';
    field.element.appendChild(foodItem);
  }
}
const food = new Food({
  foodWidth: 20,
  foodHeight: 20
});

food.renderFood();

// snake class
class Snake {
  constructor(options) {
    this.options = options;
    this.snakeItems = [];
    this.headCoordination = [];
  }

  initSnake() {
    this.renderSnake();
    this.moveFunction();
    this.chageDirection();
    this.chageDirection();
  }

  renderSnake() {
    let length = this.options.snake.defaultSize;
    for (let i = 0; i < length; i++) {
      let snakeItem = document.createElement('div');
      snakeItem.className = 'snake-item';
      snakeItem.style.width = this.options.snake.widthItem + 'px';
      snakeItem.style.height = this.options.snake.heightItem + 'px';
      snakeItem.style.top = 0;
      snakeItem.style.left = i * this.options.snake.widthItem + 'px';

      this.snakeItems.push({
        element: snakeItem,
        positionX: i,
        positionY: 0,
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
            if (head.direction !== 'top') head.direction = 'bottom';
            break;
          case 39:
            if (head.direction !== 'left') head.direction = 'right';
            break;
          case 38:
            if (head.direction !== 'bottom') head.direction = 'top';
            break;
          case 37:
            if (head.direction !== 'right') head.direction = 'left';
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
        foodItem.remove();
        this.addTail();
        food.renderFood();
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
    let headSnake = this.snakeItems[this.snakeItems.length - 1].element;

    for (let i = 0; i < this.snakeItems.length - 1; i++) {
      if (
        headSnake.style.left === this.snakeItems[i].element.style.left &&
        headSnake.style.top === this.snakeItems[i].element.style.top
      ) {
        return true;
      }
    }

    if (
      headSnake.positionX === field.options.cellWidth ||
      headSnake.positionX < 0 ||
      headSnake.positionY === field.options.cellHeight ||
      headSnake.positionY < 0
    ) {
      return true;
    }
    return false;
  }
  moveFunction() {
    if (!this.checkEndGame()) {
      this.move();
      setTimeout(() => {
        this.moveFunction();
      }, this.options.speed);
    }
  }
}

const snake = new Snake({
  snake: {
    defaultSize: 3,
    widthItem: 20,
    heightItem: 20
  },
  directionDefault: 'right',
  speed: 200
});

snake.initSnake();
