/** @constructor Snake
 *  Constructs a new snake object.
 */
function Snake() {
  var self = this;

  this.cellSize = 10;
  this.width = 15;
  this.height = 15;
  this.snake = [{ x:8, y:8 }, { x:7, y:8 }, { x:6, y:8 }];
  this.direction = "right";
  this.nextDir = "right";
  this.food = [];
  this.running = true;

  var canvas = document.createElement("canvas");
  canvas.width = this.width * this.cellSize;
  canvas.height = this.height * this.cellSize;
  document.body.appendChild(canvas);
  this.ctx = canvas.getContext("2d");

  window.onkeydown = this.handleKeyDown(this);

  this.loopID = setInterval(() => this.loop(), 1000);
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
      }
    }
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

    // draw snake
    this.ctx.fillStyle = "red";
    this.snake.forEach((segment) => {
      this.ctx.fillRect(segment.x * this.cellSize,
        segment.y * this.cellSize,
        this.cellSize,
        this.cellSize);
    });

    // draw bug
    this.ctx.fillStyle = "green";
    this.food.forEach((food) => {
      this.ctx.fillRect(food.x * this.cellSize,
        food.y * this.cellSize,
        this.cellSize,
        this.cellSize);
    });
  },
  /** @function update
   *  Updates snake as it moves.
   */
  update: function() {
    var x = this.snake[0].x;
    var y = this.snake[0].y;

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

    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      this.running = false;
      return;
    }

    this.snake.pop();
    this.snake.unshift({ x:x, y:y });
  },
  /** @function loop
   *  Runs a loop of updating and rendering the game, ends the loop if the end condition has been met.
   */
  loop: function() {
    this.update();
    this.render();

    if (!this.running) {
      clearInterval(this.loopID);
      new Snake();
    }
  }
};

new Snake();
