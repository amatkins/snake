/** @constructor Controller
 *  Constructs a new world object for the game to take place in.
 *  @param {Integer}  highScore   The latest high score.
 */
function Controller(highScore) {
  this.cellSize = 10;
  this.width = 25;
  this.widthMax = 45
  this.height = 21;
  this.heightMax = 37;
  this.highScore = highScore;
  this.snakes = [
    new Snake(Math.ceil(this.width/2)+3, Math.ceil(this.height/2), "right", "red", false),
    new Snake(Math.ceil(this.width/2)-3, Math.ceil(this.height/2), "left", "purple", true)
  ];
  this.food = [];
  this.foodTypes = [{ value:1, color:"blue" }, { value:3, color:"green" }, { value:5, color:"yellow" }];
  // running, pause, refresh, over, reset
  this.state = "pause";
  this.speed = 1000;
  this.maxSpeed = 200;

  this.canvas = document.createElement("canvas");
  this.canvas.width = this.width * this.cellSize;
  this.canvas.height = this.height * this.cellSize + 43;
  document.body.appendChild(this.canvas);
  this.ctx = this.canvas.getContext("2d");
  this.ctx.font = "14px Arial";

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
      this.width * this.cellSize + 43);

    this.ctx.strokeStyle = "white"
    var startX = this.snakes[0].segments[0].x * this.cellSize + this.cellSize / 2;
    var startY = this.snakes[0].segments[0].y * this.cellSize + this.cellSize / 2;
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
      this.renderFace(snake);
    });

    // draw food pellets
    this.food.forEach((food) => {
      this.ctx.fillStyle = food.color;
      this.ctx.fillRect(food.x * this.cellSize,
        food.y * this.cellSize,
        this.cellSize,
        this.cellSize);
    });

    this.ctx.fillStyle = "orange";
    this.ctx.fillText(`High Score: ${this.highScore}`, 10, (this.height + 1) * this.cellSize + 24);
  },

  /** @function renderFace
   *  Renders a face on the front of the snake.
   *  @param  {Snake} snake The snake object to render a face on.
   */
  renderFace: function(snake) {
    var segment = snake.segments[0];

    this.ctx.fillStyle = "white";
    switch(snake.direction) {
      case "up":
        this.ctx.fillRect(segment.x * this.cellSize + 1, (segment.y + 1) * this.cellSize - 3, 2, 2);
        this.ctx.fillRect((segment.x + 1) * this.cellSize - 3, (segment.y + 1) * this.cellSize - 3, 2, 2);
        break;
      case "left":
        this.ctx.fillRect((segment.x + 1) * this.cellSize - 3, segment.y * this.cellSize + 1, 2, 2);
        this.ctx.fillRect((segment.x + 1) * this.cellSize - 3, (segment.y + 1) * this.cellSize - 3, 2, 2);
        break;
      case "down":
        this.ctx.fillRect(segment.x * this.cellSize + 1, segment.y * this.cellSize + 1, 2, 2);
        this.ctx.fillRect((segment.x + 1) * this.cellSize - 3, segment.y * this.cellSize + 1, 2, 2);
        break;
      case "right":
        this.ctx.fillRect(segment.x * this.cellSize + 1, segment.y * this.cellSize + 1, 2, 2);
        this.ctx.fillRect(segment.x * this.cellSize + 1, (segment.y + 1) * this.cellSize - 3, 2, 2);
        break;
    }
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

  /** @function removeSnake
   *  Removes a snake from the world if there are still more players, otherwise, ends the game.
   *  @param  {Integer} sIndex The index of the snake to remove.
   */
  removeSnake: function(sIndex) {
    if (this.snakes.reduce((sum, snake) => {
      if (!snake.ai)
        sum++;
      return sum;
    }, 0) === 1) {
      this.state = "over";
      return;
    }

    this.snakes.splice(sIndex, 1);
  },

  /** @function replaceSnake
   *  Replaces a snake in the world at a predefined start point.
   *  @param  {Integer} sIndex The index of the snake to replace.
   */
  replaceSnake(sIndex) {
    var snake = this.snakes[sIndex];

    this.snakes[sIndex] = new Snake(
      Math.ceil(this.width / 2),
      Math.ceil(this.height / 2),
      snake.direction,
      snake.color,
      snake.ai,
      snake.lives- 1,
      snake.score
    );
  },

  /** @function moveAI
   *  Calculates a move for the AI.
   *  @param  {Integer} sIndex The inde of the AI snake.
   */
  moveAI: function(sIndex) {
    var x, y, tail, pellet;

    // Go towards food if possible
    x = this.snakes[sIndex].segments[0].x;
    y = this.snakes[sIndex].segments[0].y;
    pellet = this.food.pop();

    if (x > pellet.x && this.snakes[sIndex].direction !== "right") {
      this.snakes[sIndex].nextDir = "left";
    } else if (x < pellet.x && this.snakes[sIndex].direction !== "left") {
      this.snakes[sIndex].nextDir = "right";
    } else {
      if (y > pellet.y && this.snakes[sIndex].direction !== "down") {
        this.snakes[sIndex].nextDir = "up";
      } else if (this.snakes[sIndex].direction !== "up") {
        this.snakes[sIndex].nextDir = "down";
      }
    }

    this.food.push(pellet);

    for (let i = 0; i < 4; i++) {
      x = this.snakes[sIndex].segments[0].x;
      y = this.snakes[sIndex].segments[0].y;

      switch(this.snakes[sIndex].nextDir) {
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

      tail = this.snakes[sIndex].segments.pop();

      // Check if the direction it's headed is valid
      if (x < 0 || x >= this.width || y < 0 || y >= this.height ||
        this.snakes.find((entity) => {
          return entity.segments.find((segment) => {
            return segment.x === x && segment.y === y;
          });
        })
      ) {
        // If not check another direction
        switch(this.snakes[sIndex].nextDir) {
          case "up":
            if (this.snakes[sIndex].direction !== "right")
              this.snakes[sIndex].nextDir = "left";
            else
              this.snakes[sIndex].nextDir = "down";
            break;
          case "left":
            if (this.snakes[sIndex].direction !== "up")
              this.snakes[sIndex].nextDir = "down";
            else
              this.snakes[sIndex].nextDir = "right";
            break;
          case "down":
            if (this.snakes[sIndex].direction !== "left")
              this.snakes[sIndex].nextDir = "right";
            else
              this.snakes[sIndex].nextDir = "up";
            break;
          case "right":
            if (this.snakes[sIndex].direction !== "down")
              this.snakes[sIndex].nextDir = "up";
            else
              this.snakes[sIndex].nextDir = "left";
            break;
        }
        this.snakes[sIndex].segments.push(tail);
      // If it is a valid direction choose that one
      } else {
        this.snakes[sIndex].segments.push(tail);
        return;
      }
    }
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

    var tail = this.snakes[sIndex].segments.pop();

    if (x < 0 || x >= this.width || y < 0 || y >= this.height ||
      this.snakes.find((entity) => {
        return entity.segments.find((segment) => {
          return segment.x === x && segment.y === y;
        });
      })
    ) {
      if (this.snakes[sIndex].ai || this.snakes[sIndex].lives > 0)
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
      if (this.snakes[sIndex].segments.length % 10 === 0) {
        if (this.width < this.widthMax)
          this.width++;
        if (this.height < this.heightMax)
          this.height++;
        this.canvas.width = this.width * this.cellSize;
        this.canvas.height = this.height * this.cellSize + 43;
      }
      if ((this.snakes[sIndex].segments.length- 1) % (30 * Math.pow(2, this.snakes[sIndex].lives)) === 0)
        this.snakes[sIndex].lives++;

      this.snakes[sIndex].segments.push(tail);
    }

    if (this.food.length === 0)
      this.foodTypes.forEach((food) => {
        this.placeFood(food.value, food.color);
      });
  },

  /** @function pause
   *  Pauses the game.
   */
  pause: function() {
    this.state = "pause";
    clearInterval(this.loopID);
    this.render();
    this.ctx.fillText(`Paused, Points: ${this.snakes[0].score}, Lives: ${this.snakes[0].lives}`, 10, (this.height + 1) * this.cellSize + 5);
  },

  /** @function unpause
   *  Unpauses the game.
   */
  unpause: function() {
    this.state = "running";
    this.loopID = setInterval(() => this.loop(), this.speed);
    this.render();
    this.ctx.fillText(`Running, Points: ${this.snakes[0].score}, Lives: ${this.snakes[0].lives}`, 10, (this.height + 1) * this.cellSize + 5);
  },

  /** @function reset
   *  Restarts the entire game.
   */
  reset: function() {
    document.body.removeChild(this.canvas);
    new Controller(this.snakes[0].score > this.highScore ? this.snakes[0].score : this.highScore);
  },

  /** @function loop
   *  Runs a loop of updating and rendering the game.
   *  The loop is controlled by a state variable and is run with a speed variable.
   */
  loop: function() {
    for (let i = 0; i < this.snakes.length; i++) {
      if (this.snakes[i].ai)
        this.moveAI(i);
      this.update(i);
    }
    this.render();
    this.ctx.fillText(`Running, Points: ${this.snakes[0].score}, Lives: ${this.snakes[0].lives}`, 10, (this.height + 1) * this.cellSize + 5);

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
        this.render();
        this.ctx.fillText(`Game Over, Points: ${this.snakes[0].score}`, 10, (this.height + 1) * this.cellSize + 5);
        break;
    }
  }
};

/** @constructor Snake
 *  Constructs a new snake object.
 */
function Snake(x, y, dir, color, ai, lives = 0, score = 0) {
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
  this.lives = lives;
  this.score = score;
}

Snake.prototype = {
  /** @function inputUp
   *  Attempts to change the direction to "up".
   */
  inputUp: function() {
    if (this.direction !== "down")
      this.nextDir = "up";
  },

  /** @function inputLeft
   *  Attempts to change the direction to "left".
   */
  inputLeft: function() {
    if (this.direction !== "right")
      this.nextDir = "left";
  },

  /** @function inputDown
   *  Attempts to change the direction to "down".
   */
  inputDown: function() {
    if (this.direction !== "up")
      this.nextDir = "down";
  },

  /** @function inputRight
   *  Attempts to change the direction to "right".
   */
  inputRight: function() {
    if (this.direction !== "left")
      this.nextDir = "right";
  },
};

new Controller(0);
