function Controller() {
  this.cellSize = 10;
  this.width = 21;
  this.widthMax = 35
  this.height = 15;
  this.heightMax = 29;
  this.snakes = [new Snake(14, 8, "right", "red", false), new Snake(8, 8, "left", "purple", true)];
  this.food = [];
  this.foodTypes = [{ value:1, color:"blue" }, { value:3, color:"green" }, { value:5, color:"yellow" }];
  // running, pause, refresh, over, reset
  this.state = "pause";
  this.speed = 1000;
  this.maxSpeed = 150;

  this.canvas = document.createElement("canvas");
  this.canvas.width = this.width * this.cellSize;
  this.canvas.height = this.height * this.cellSize;
  document.body.appendChild(this.canvas);
  this.ctx = this.canvas.getContext("2d");

  this.textBox = document.createElement("p");
  this.textBox.innerHTML = "Paused, Points: " + this.snakes[0].score;
  document.body.appendChild(this.textBox);

  window.onkeydown = this.handleKeyDown(this);

  this.render();
}

Controller.prototype = {
  /** @function handleKeyDown
   *  Handles motion input of the snake.
   *  @param  {Object} event The key down event that was triggered.
   */
  handleKeyDown: function(self) {
    return function(event) {
      switch (String.fromCharCode(event.keyCode)) {
        case 'W':
          self.snakes[0].inputUp();
          break;
        case 'A':
          self.snakes[0].inputLeft();
          break;
        case 'S':
          self.snakes[0].inputDown();
          break;
        case 'D':
          self.snakes[0].inputRight();
          break;
        case 'P':
          switch (self.state) {
            case "running":
              self.pause();
              break;
            case "pause":
              self.unpause();
              break;
            case "over":
              self.reset();
              break;
          }
          break;
      }
    }
  },

  /** @function drawLine
   *  Draws a line from the starting position to the ending position.
   *  @param  {Integer} sX The starting x position.
   *  @param  {Integer} sY The starting y position.
   *  @param  {Integer} eX The ending x position.
   *  @param  {Integer} eY The ending y position.
   */
  drawLine: function(sX, sY, eX, eY) {
    this.ctx.beginPath();
    this.ctx.moveTo(sX, sY);
    this.ctx.lineTo(eX, eY);
    this.ctx.stroke();
  },

  /** @function render
   *  Renders the snake segments and food pellets
   */
  render: function() {
    // fill screen
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0,
      this.width * this.cellSize,
      this.height * this.cellSize);

    this.ctx.strokeStyle = "white"
    var startX = (this.snakes[0].segments[0].x) * this.cellSize + this.cellSize / 2;
    var startY = (this.snakes[0].segments[0].y) * this.cellSize + this.cellSize / 2;
    switch(this.snakes[0].direction) {
      case "up":
        this.drawLine(startX, startY,startX, 0);
        break;
      case "left":
        this.drawLine(startX, startY, 0, startY);
        break;
      case "down":
        this.drawLine(startX, startY, startX, this.height * this.cellSize - 1);
        break;
      case "right":
        this.drawLine(startX, startY, this.width * this.cellSize - 1, startY);
        break;
    }

    // draw snakes
    this.snakes.forEach((snake) => {
      this.ctx.fillStyle = snake.color;
      snake.segments.forEach((segment) => {
        this.ctx.fillRect(segment.x * this.cellSize, segment.y * this.cellSize,
          this.cellSize, this.cellSize);
      });
    });

    // draw food pellets
    this.food.forEach((food) => {
      this.ctx.fillStyle = food.color;
      this.ctx.fillRect(food.x * this.cellSize,
        food.y * this.cellSize,
        this.cellSize,
        this.cellSize);
    });

    this.textBox.innerHTML = "Running, Points: " + this.snakes[0].score;
  },

  /** @function placeFood
   *  Places a pellet of food in a position that doesn't have a pellet or snake segment.
   */
  placeFood: function(value, color) {
    var x = Math.floor(Math.random() * (this.width - 2) + 1);
    var y = Math.floor(Math.random() * (this.height - 2) + 1);

    while (this.snakes.find((snake) => {
        return snake.segments.find((segment) => {
          return segment.x === x && segment.y === y;
        });
      }) || this.food.find((pellet) => {
        return pellet.x === x && pellet.y === y;
      })
    ) {
      x = Math.floor(Math.random() * (this.width - 2) + 1);
      y = Math.floor(Math.random() * (this.height - 2) + 1);
    }

    this.food.push({ x:x, y:y, value:value, color:color });
  },

  removeSnake: function(sIndex) {
    this.snakes.splice(sIndex, 1);

    if (this.snakes.reduce((sum, snake) => {
      if (!snake.ai)
        sum++;
      return sum;
    }, 0) === 0) {
      this.state = "over";
    }
  },

  replaceSnake(sIndex) {
    var snake = this.snakes[sIndex];

    this.snakes[sIndex] = new Snake(
      Math.ceil(this.width / 2),
      Math.ceil(this.height / 2),
      snake.direction,
      snake.color,
      snake.ai
    );
  },

  /** @function update
   *  Updates snake as it moves.
   */
  update: function(sIndex) {
    var x = this.snakes[sIndex].segments[0].x;
    var y = this.snakes[sIndex].segments[0].y;
    var ate = false;

    if (this.snakes[sIndex].nextDir !== this.snakes[sIndex].direction)
      this.snakes[sIndex].direction = this.snakes[sIndex].nextDir;

    switch(this.snakes[sIndex].direction) {
      case "up":
        y--;
        break;
      case "left":
        x--;
        break;
      case "down":
        y++;
        break;
      case "right":
        x++;
        break;
    }

    if (x < 0 || x >= this.width || y < 0 || y >= this.height ||
      this.snakes.find((entity) => {
        return entity.segments.find((segment) => {
          return segment.x === x && segment.y === y;
        });
      })
    ) {
      if (this.snakes[sIndex].ai)
        this.replaceSnake(sIndex);
      else
        this.removeSnake(sIndex);
      return;
    }

    for (let i = 0; i < this.food.length; i++) {
      if (this.food[i].x === x && this.food[i].y === y) {
        ate = true;
        this.snakes[sIndex].score += this.food[i].value;
        this.food = [];
      }
    }

    this.snakes[sIndex].segments.unshift({ x:x, y:y });
    if (ate) {
      if (this.speed > this.maxSpeed) {
        this.speed -= 50;
        this.state = "refresh";
      }
      if (this.snakes[sIndex].segments.length % 10 == 0) {
        if (this.width < this.widthMax)
          this.width++;
        if (this.height < this.heightMax)
          this.height++;
        this.canvas.width = this.width * this.cellSize;
        this.canvas.height = this.height * this.cellSize;
      }
    } else
      this.snakes[sIndex].segments.pop();

    if (this.food.length === 0)
      this.foodTypes.forEach((food) => {
        this.placeFood(food.value, food.color);
      });
  },

  pause: function() {
    this.state = "pause";
    clearInterval(this.loopID);
    this.textBox.innerHTML = "Paused, Points: " + this.snakes[0].score;
  },

  unpause: function() {
    this.state = "running";
    this.loopID = setInterval(() => this.loop(), this.speed);
    this.textBox.innerHTML = "Running, Points: " + this.snakes[0].score;
  },

  reset: function() {
    document.body.removeChild(this.canvas);
    document.body.removeChild(this.textBox);
    new Controller();
  },

  /** @function loop
   *  Runs a loop of updating and rendering the game, ends the loop if the end condition has been met.
   */
  loop: function() {
    for (let i = 0; i < this.snakes.length; i++) {
      this.update(i);
    }
    this.render();

    switch (this.state) {
      case "running":
        break;
      case "pause":
        break;
      case "refresh":
        clearInterval(this.loopID);
        this.state = "running";
        this.loopID = setInterval(() => this.loop(), this.speed);
        break;
      case "over":
        clearInterval(this.loopID);
        this.textBox.innerHTML = "Game Over, Points: " + this.score;
        break;
    }
  }
};

/** @constructor Snake
 *  Constructs a new snake object.
 */
function Snake(x, y, dir, color, ai) {
  this.segments = [{ x:x, y:y }];
  switch (dir) {
    case "up":
      this.segments.push({ x:x, y:y+1 });
      this.segments.push({ x:x, y:y+2 });
      break;
    case "left":
      this.segments.push({ x:x+1, y:y });
      this.segments.push({ x:x+2, y:y });
      break;
    case "down":
      this.segments.push({ x:x, y:y-1 });
      this.segments.push({ x:x, y:y-2 });
      break;
    case "right":
      this.segments.push({ x:x-1, y:y });
      this.segments.push({ x:x-2, y:y });
      break;
  }
  this.direction = dir;
  this.nextDir = dir;
  this.color = color;
  this.ai = ai;
  this.score = 0;
}

Snake.prototype = {
  inputUp: function() {
    if (this.direction !== "down")
      this.nextDir = "up";
  },

  inputLeft: function() {
    if (this.direction !== "right")
      this.nextDir = "left";
  },

  inputDown: function() {
    if (this.direction !== "up")
      this.nextDir = "down";
  },

  inputRight: function() {
    if (this.direction !== "left")
      this.nextDir = "right";
  },


};

new Controller();
