/** @constructor Snake
 *  Constructs a new snake object.
 */
function Snake() {
  var self = this;

  this.cellSize = 10;
  this.width = 21;
  this.widthMax = 35
  this.height = 15;
  this.heightMax = 29;
  this.snake = [{ x:11, y:8 }, { x:10, y:8 }, { x:9, y:8 }];
  this.direction = "right";
  this.nextDir = "right";
  this.food = [];
  this.foodTypes = [{ value:1, color:"blue" }, { value:3, color:"green" }, { value:5, color:"yellow" }];
  this.score = 0;
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
  this.textBox.innerHTML = "Paused, Points: " + this.score;
  document.body.appendChild(this.textBox);

  window.onkeydown = this.handleKeyDown(this);

  this.render();
}

Snake.prototype = {
  /** @function handleKeyDown
   *  Handles motion input of the snake.
   *  @param  {Object} event The key down event that was triggered.
   */
  handleKeyDown: function(self) {
    return function(event) {
      switch (String.fromCharCode(event.keyCode)) {
        case 'W':
          if (self.direction !== "down")
            self.nextDir = "up";
          break;
        case 'A':
          if (self.direction !== "right")
            self.nextDir = "left";
          break;
        case 'S':
          if (self.direction !== "up")
            self.nextDir = "down";
          break;
        case 'D':
          if (self.direction !== "left")
            self.nextDir = "right";
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
    var startX;
    var startY;
    var endX;
    var endY;

    // fill screen
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0,
      this.width * this.cellSize,
      this.height * this.cellSize);

      this.ctx.strokeStyle = "white"
      switch(this.direction) {
        case "up":
          startX = (this.snake[0].x) * this.cellSize + 1;
          startY = (this.snake[0].y) * this.cellSize + 1;
          endX = startX;
          endY = 0;
          this.drawLine(startX, startY, endX, endY);
          startX = (this.snake[0].x + 1) * this.cellSize - 1;
          startY = (this.snake[0].y + 1) * this.cellSize - 1;
          endX = startX;
          endY = 0;
          this.drawLine(startX, startY, endX, endY);
          break;
        case "left":
          startX = (this.snake[0].x) * this.cellSize + 1;
          startY = (this.snake[0].y) * this.cellSize + 1;
          endX = 0;
          endY = startY;
          this.drawLine(startX, startY, endX, endY);
          startX = (this.snake[0].x + 1) * this.cellSize - 1;
          startY = (this.snake[0].y + 1) * this.cellSize - 1;
          endX = 0;
          endY = startY;
          this.drawLine(startX, startY, endX, endY);
          break;
        case "down":
          startX = (this.snake[0].x) * this.cellSize + 1;
          startY = (this.snake[0].y) * this.cellSize + 1;
          endX = startX;
          endY = this.height * this.cellSize - 1;
          this.drawLine(startX, startY, endX, endY);
          startX = (this.snake[0].x + 1) * this.cellSize - 1;
          startY = (this.snake[0].y + 1) * this.cellSize - 1;
          endX = startX;
          endY = this.height * this.cellSize - 1;
          this.drawLine(startX, startY, endX, endY);
          break;
        case "right":
          startX = (this.snake[0].x) * this.cellSize + 1;
          startY = (this.snake[0].y) * this.cellSize + 1;
          endX = this.width * this.cellSize - 1;
          endY = startY;
          this.drawLine(startX, startY, endX, endY);
          startX = (this.snake[0].x + 1) * this.cellSize - 1;
          startY = (this.snake[0].y + 1) * this.cellSize - 1;
          endX = this.width * this.cellSize - 1;
          endY = startY;
          this.drawLine(startX, startY, endX, endY);
          break;
      }

    // draw snake
    this.ctx.fillStyle = "red";
    this.snake.forEach((segment) => {
      this.ctx.fillRect(segment.x * this.cellSize,
        segment.y * this.cellSize,
        this.cellSize,
        this.cellSize);
    });

    // draw bug
    this.food.forEach((food) => {
      this.ctx.fillStyle = food.color;
      this.ctx.fillRect(food.x * this.cellSize,
        food.y * this.cellSize,
        this.cellSize,
        this.cellSize);
    });
  },

  /** @function placeFood
   *  Places a pellet of food in a position that doesn't have a pellet or snake segment.
   */
  placeFood: function(value, color) {
    var x = Math.floor(Math.random() * (this.width - 2) + 1);
    var y = Math.floor(Math.random() * (this.height - 2) + 1);

    while (this.snake.find((segment) => {return segment.x === x && segment.y === y;}) || this.food.find((pellet) => {return pellet.x === x && pellet.y === y;})) {
      x = Math.floor(Math.random() * (this.width - 2) + 1);
      y = Math.floor(Math.random() * (this.height - 2) + 1);
    }

    this.food.push({ x:x, y:y, value:value, color:color });
  },

  /** @function update
   *  Updates snake as it moves.
   */
  update: function() {
    var x = this.snake[0].x;
    var y = this.snake[0].y;
    var ate = false;

    if (this.nextDir !== this.direction)
      this.direction = this.nextDir;

    switch(this.direction) {
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

    if (x < 0 || x >= this.width || y < 0 || y >= this.height || this.snake.find((segment) => {return segment.x === x && segment.y === y;})) {
      this.state = "over";
      return;
    }

    for (let i = 0; i < this.food.length; i++) {
      if (this.food[i].x === x && this.food[i].y === y) {
        ate = true;
        this.score += this.food[i].value;
        this.food = [];
      }
    }

    this.snake.unshift({ x:x, y:y });
    if (ate) {
      if (this.speed > this.maxSpeed) {
        this.speed -= 50;
        this.state = "refresh";
      }
      if (this.snake.length % 10 == 0) {
        if (this.width < this.widthMax)
          this.width++;
        if (this.height < this.heightMax)
          this.height++;
        this.canvas.width = this.width * this.cellSize;
        this.canvas.height = this.height * this.cellSize;
      }

      this.textBox.innerHTML = "Running, Points: " + this.score;
    } else
      this.snake.pop();

    if (this.food.length === 0)
      this.foodTypes.forEach((food) => {
        this.placeFood(food.value, food.color);
      });
  },

  pause: function() {
    this.state = "pause";
    clearInterval(this.loopID);
    this.textBox.innerHTML = "Paused, Points: " + this.score;
  },

  unpause: function() {
    this.state = "running";
    this.loopID = setInterval(() => this.loop(), this.speed);
    this.textBox.innerHTML = "Running, Points: " + this.score;
  },

  reset: function() {
    document.body.removeChild(this.canvas);
    document.body.removeChild(this.textBox);
    new Snake();
  },

  /** @function loop
   *  Runs a loop of updating and rendering the game, ends the loop if the end condition has been met.
   */
  loop: function() {
    this.update();
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

new Snake();
