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

  move() {
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
    defaultSize: 10,
    widthItem: 20,
    heightItem: 20
  },
  directionDefault: 'right',
  speed: 200
});

snake.initSnake();

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
    foodItem.style.left = this.options.positionX + 'px';
    foodItem.style.top = this.options.positionY + 'px';
    console.log(foodItem.style.top);
    console.log(foodItem.style.left);
    field.element.appendChild(foodItem);

    for (let i = 0; i < snake.snakeItems.length; i++) {
      if (
        snake.snakeItems[i].element.style.left === foodItem.style.left ||
        snake.snakeItems[i].element.style.top === foodItem.style.top
      ) {
        this.renderFood();
      }
      return;
    }
  }
}
const food = new Food({
  foodWidth: 20,
  foodHeight: 20,
  positionX:
    Math.floor(Math.random() * field.options.sizeX) * field.options.cellWidth,
  positionY:
    Math.floor(Math.random() * field.options.sizeY) * field.options.cellHeight
});

food.renderFood();
