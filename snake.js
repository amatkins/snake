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
    new Snake({ x:Math.ceil(this.width/2)+3, y:Math.ceil(this.height/2), dir:"right" }, "red", { on:true, goalType:"closest" }, { extra:1, ignore:false }),
    new Snake({ x:Math.ceil(this.width/2)-3, y:Math.ceil(this.height/2), dir:"left" }, "purple", { on:true, goalType:"max" }, { extra:0, ignore:true })
  ];
  this.food = [];
  this.foodTypes = [{ value:1, color:"blue" }, { value:3, color:"green" }, { value:5, color:"yellow" }];
  // running, pause, refresh, over, reset
  this.state = "pause";
  this.speed = 600;
  this.maxSpeed = 175;

  this.canvas = document.createElement("canvas");
  this.canvas.width = this.width * this.cellSize;
  this.canvas.height = this.height * this.cellSize + 43;
  document.body.appendChild(this.canvas);
  this.ctx = this.canvas.getContext("2d");
  this.ctx.font = "10px Arial";

  window.onkeydown = this.handleKeyDown(this);

  this.foodTypes.forEach((food) => {
    this.placeFood(food.value, food.color);
  });
  this.setGoals();

  this.render();
  this.ctx.fillText(`Paused - Interval: ${this.speed}`, 10, (this.height + 1) * this.cellSize + 5);
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

  /** @function renderFace
   *  Renders a face on the front of the snake.
   *  @param  {Snake} entity The snake object to render a face on.
   */
  renderFace: function(entity) {
    var segment = entity.segments[0];

    this.ctx.fillStyle = "white";
    switch(entity.dir.curr) {
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
    switch(this.snakes[0].dir.curr) {
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
    this.snakes.forEach((entity) => {
      this.ctx.fillStyle = entity.color;

      entity.segments.forEach((segment) => {
        this.ctx.fillRect(segment.x * this.cellSize, segment.y * this.cellSize,
          this.cellSize, this.cellSize);
      });

      this.renderFace(entity);
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
    this.ctx.fillText(`Your Score: ${this.snakes[0].score} - High Score: ${this.highScore} - Extra Lives: ${this.snakes[0].lives.extra}`, 10, (this.height + 1) * this.cellSize + 24);
  },

  /** @function placeFood
   *  Places a pellet of food in a position that doesn't have a pellet or snake segment.
   */
  placeFood: function(value, color) {
    var x = Math.floor(Math.random() * (this.width - 2) + 1);
    var y = Math.floor(Math.random() * (this.height - 2) + 1);

    while (this.snakes.find((entity) => {
        return entity.segments.find((segment) => {
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
    if (this.snakes.filter((entity) => {return !entity.ai.on;}).length === 1
      || ( this.snakes.filter((entity) => {return !entity.ai.on;}).length === 0
      && this.snakes.length === 2)
    ) {
      this.state = "over";
      return;
    }

    this.snakes.splice(sIndex, 1);
  },

  /** @function replaceSnake
   *  Replaces a snake in the world at a predefined start point.
   *  @param  {Integer} sIndex The index of the snake to replace.
   */
  replaceSnake(sIndex, total, offset) {
    let snake = this.snakes[sIndex];

    this.snakes[sIndex] = new Snake(
      snake.spawn,
      snake.color,
      snake.ai,
      { extra:snake.lives.extra - (snake.lives.ignore ? 0 : 1), ignore:snake.lives.ignore },
      snake.score
    );
  },

  /** @function findClosest
   *  Returns the index of the food piece closes to the head of the provided snake.
   *  @param  {Object} head     The head of the snake to use.
   *  @return {Integer}         The index of the food pellet closest to the snake.
   */
  findClosest: function(head) {
    var distances = [];

    this.food.forEach((pellet) => {
      distances.push(Math.abs(head.x - pellet.x) + Math.abs(head.y - pellet.y));
    });

    return distances.indexOf(Math.min.apply(null, distances));
  },

  /** @function setGoals
   *  Sets the goals of each of the AI.
   */
  setGoals: function() {
    this.snakes.forEach((entity) => {
      if (entity.ai.on) {
        switch (entity.ai.goalType) {
          case "closest":
            entity.ai.goal = this.findClosest(entity.segments[0]);
            break;
          case "max":
            entity.ai.goal = this.food.length - 1;
            break;
          case "random":
            entity.ai.goal = Math.round(Math.random() * this.food.length - 1);
            break;
        }
      }
    });
  },

  /** @function steerAI
   *  Calculates a move for the AI.
   *  @param  {Integer} sIndex The inde of the AI snake.
   */
  steerAI: function(sIndex) {
    var x, y,
      tail = this.snakes[sIndex].segments.pop(),
      dir = { up:true, left:true, down:true, right:true },
      pellet = this.food[this.snakes[sIndex].ai.goal];

    for (let i = 0; i < 4; i++) {
      x = this.snakes[sIndex].segments[0].x;
      y = this.snakes[sIndex].segments[0].y;

      if (x > pellet.x) {
        if (this.snakes[sIndex].dir.curr !== "right" && dir["left"])
          this.snakes[sIndex].dir.next = "left";
        else if (y > pellet.y && this.snakes[sIndex].dir.cur !== "down" && dir["up"])
          this.snakes[sIndex].dir.next = "up";
        else if (y < pellet.y && this.snakes[sIndex].dir.curr !== "up" && dir["down"])
          this.snakes[sIndex].dir.next = "down";
        else {
          if (this.snakes[sIndex].dir.curr !== "down" && dir["up"])
            this.snakes[sIndex].dir.next = "up";
          else if (this.snakes[sIndex].dir.curr !== "up" && dir["down"])
            this.snakes[sIndex].dir.next = "down";
          else
            this.snakes[sIndex].dir.next = "right";
        }
      } else if (x < pellet.x) {
        if (this.snakes[sIndex].dir.curr !== "left" && dir["right"])
          this.snakes[sIndex].dir.next = "right";
        else if (y > pellet.y && this.snakes[sIndex].dir.curr !== "down" && dir["up"])
          this.snakes[sIndex].dir.next = "up";
        else if (y < pellet.y && this.snakes[sIndex].dir.curr !== "up" && dir["down"])
          this.snakes[sIndex].dir.next = "down";
        else {
          if (this.snakes[sIndex].dir.curr !== "down" && dir["up"])
            this.snakes[sIndex].dir.next = "up";
          else if (this.snakes[sIndex].dir.curr !== "up" && dir["down"])
            this.snakes[sIndex].dir.next = "down";
          else
            this.snakes[sIndex].dir.next = "left";
        }
      } else {
        if (y > pellet.y) {
          if (this.snakes[sIndex].dir.curr !== "down" && dir["up"])
            this.snakes[sIndex].dir.next = "up";
          else if (this.snakes[sIndex].dir.curr !== "right" && dir["left"])
            this.snakes[sIndex].dir.next = "left";
          else if (this.snakes[sIndex].dir.curr !== "left" && dir["right"])
            this.snakes[sIndex].dir.next = "right";
          else
            this.snakes[sIndex].dir.next = "down";
        } else if (y < pellet.y) {
          if (this.snakes[sIndex].dir.curr !== "up" && dir["down"])
            this.snakes[sIndex].dir.next = "down";
          else if (this.snakes[sIndex].dir.curr !== "right" && dir["left"])
            this.snakes[sIndex].dir.next = "left";
          else if (this.snakes[sIndex].dir.curr !== "left" && dir["right"])
            this.snakes[sIndex].dir.next = "right";
          else
            this.snakes[sIndex].dir.next = "up";
        } else {
          if (this.snakes[sIndex].dir.curr !== "down" && dir["up"])
            this.snakes[sIndex].dir.next = "up";
          else if (this.snakes[sIndex].dir.curr !== "right" && dir["left"])
            this.snakes[sIndex].dir.next = "left";
          else if (this.snakes[sIndex].dir.curr !== "up" && dir["down"])
            this.snakes[sIndex].dir.next = "right";
          else if (this.snakes[sIndex].dir.curr !== "left" && dir["right"])
            this.snakes[sIndex].dir.next = "down";
        }
      }

      switch(this.snakes[sIndex].dir.next) {
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

      // Check if the direction it's headed is valid
      if (
        x < 0 || y < 0 || x >= this.width || y >= this.height ||
        this.snakes.find((entity) => {
          return entity.segments.find((segment) => {
            return segment.x === x && segment.y === y;
          });
        })
      ) {
        dir[this.snakes[sIndex].dir.next] = false;
      } else {
        this.snakes[sIndex].segments.push(tail);
        return;
      }
    }
  },

  /** @function moveSnakes
   *  Moves all the snakes and checks if they've eaten food.
   */
  moveSnakes: function(sIndex, grow) {
    var x = this.snakes[sIndex].segments[0].x;
    var y = this.snakes[sIndex].segments[0].y;
    var ate = false;

    // Update direction that snake is moving
    this.snakes[sIndex].dir.curr = this.snakes[sIndex].dir.next;

    // Move snake in direction
    switch(this.snakes[sIndex].dir.curr) {
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

    // Determine if snake has hit food
    for (let i = 0; i < this.food.length; i++) {
      if (this.food[i].x === x && this.food[i].y === y) {
        this.snakes[sIndex].score += this.food[i].value;
        grow.push(sIndex);
        ate = true;
      }
    }

    // Give snake head at new location
    this.snakes[sIndex].segments.unshift({ x:x, y:y });

    // If the snake ate
    if (ate) {
      // Increase speed
      if (this.speed > this.maxSpeed) {
        this.speed -= 25;
        this.state = "refresh";
      }

      // If threshold met, increase screen size
      if (this.snakes[sIndex].segments.length % 10 === 0) {
        if (this.width < this.widthMax)
          this.width++;
        if (this.height < this.heightMax)
          this.height++;
        this.canvas.width = this.width * this.cellSize;
        this.canvas.height = this.height * this.cellSize + 43;
      }

      // If threshold met, increase extra lives
      if (!this.snakes[sIndex].lives.ignore && (this.snakes[sIndex].segments.length- 1) % (30 * 2 ** this.snakes[sIndex].lives) === 0)
        this.snakes[sIndex].lives.extra++;
    }
    // Remove tail to maintain length if the snake did not eat
    else
      this.snakes[sIndex].segments.pop();

    return grow;
  },

  /** @function checkHit
   *  Checks if the snake has hit an obstacle.
   *  @param  {Integer}  sIndex  The index of the snake that is being checked.
   *  @param  {Array}    grow    The list of snakes that have grown.
   *  @param  {Array}    die     The list of snakes that are already known to have died.
   *  @return {Array}            The list of snakes that are currently known to have died.
   */
  checkHit: function(sIndex, grow, die) {
    var head = this.snakes[sIndex].segments.shift();
    var tails = {};

    for (let i = 0; i < this.snakes.length; i++) {
      if (!grow.includes(i))
        tails[i] = this.snakes[i].segments.pop();
    }

    if (
      head.x < 0 || head.y < 0 || head.x >= this.width || head.y >= this.height ||
      this.snakes.find((entity) => {
        return entity.segments.find((segment) => {
          return segment.x === head.x && segment.y === head.y;
        });
      })
    ) {
      die.push(sIndex);
    }

    this.snakes[sIndex].segments.unshift(head);
    for (let i = 0; i < this.snakes.length; i++) {
      if (!grow.includes(i))
        this.snakes[i].segments.push(tails[i]);
    }

    return die;
  },

  /** @function pause
   *  Pauses the game.
   */
  pause: function() {
    this.state = "pause";
    clearInterval(this.loopID);
    this.render();
    this.ctx.fillText(`Paused - Interval: ${this.speed}`, 10, (this.height + 1) * this.cellSize + 5);
  },

  /** @function unpause
   *  Unpauses the game.
   */
  unpause: function() {
    this.state = "running";
    this.loopID = setInterval(() => this.loop(), this.speed);
    this.render();
    this.ctx.fillText(`Running - Interval: ${this.speed}`, 10, (this.height + 1) * this.cellSize + 5);
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
    var grow = [],
        die = [],
        offset = 0;

    // Steer the AI towards their goal.
    for (let i = 0; i < this.snakes.length; i++) {
      if (this.snakes[i].ai.on)
        this.steerAI(i);
    }

    // Move snakes and determine if they grow.
    for (let i = 0; i < this.snakes.length; i++) {
      this.moveSnakes(i, grow);
    }

    // Check if they've hit an obstacle
    for (let i = 0; i < this.snakes.length; i++) {
      this.checkHit(i, grow, die);
    }

    // Kill snakes that did hit obstacle
    die.forEach((death) => {
      if (!this.snakes[death].lives.ignore && this.snakes[death].lives.extra === 0) {
        this.removeSnake(death - offset);
        offset++;
      } else
        this.replaceSnake(death, die.length, offset);
    });

    // Replace food if it was consumed
    if (grow.length > 0) {
      this.food = [];
      this.foodTypes.forEach((foodType) => {
        this.placeFood(foodType.value, foodType.color);
      });

      this.setGoals();
    }

    // Render world and info
    this.render();
    this.ctx.fillText(`Running - Interval: ${this.speed}`, 10, (this.height + 1) * this.cellSize + 5);

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
        this.ctx.fillText(`Game Over - Interval: ${this.speed}`, 10, (this.height + 1) * this.cellSize + 5);
        break;
    }
  }
};

/** @constructor Snake
 *  Constructs a new snake object.
 */
function Snake(spawn, color, ai = { on:false, goalType:"random", goal:0 }, lives = { extra:0, ignore:false }, score = 0) {
  this.spawn = spawn;
  this.segments = [{ x:spawn.x, y:spawn.y }];
  switch (spawn.dir) {
    case "up":
      this.segments.push({ x:spawn.x, y:spawn.y+1 });
      this.segments.push({ x:spawn.x, y:spawn.y+2 });
      break;
    case "left":
      this.segments.push({ x:spawn.x+1, y:spawn.y });
      this.segments.push({ x:spawn.x+2, y:spawn.y });
      break;
    case "down":
      this.segments.push({ x:spawn.x, y:spawn.y-1 });
      this.segments.push({ x:spawn.x, y:spawn.y-2 });
      break;
    case "right":
      this.segments.push({ x:spawn.x-1, y:spawn.y });
      this.segments.push({ x:spawn.x-2, y:spawn.y });
      break;
  }
  this.dir = { curr: spawn.dir, next:spawn.dir };
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
    if (this.dir.curr !== "down")
      this.dir.next = "up";
  },

  /** @function inputLeft
   *  Attempts to change the direction to "left".
   */
  inputLeft: function() {
    if (this.dir.curr !== "right")
      this.dir.next = "left";
  },

  /** @function inputDown
   *  Attempts to change the direction to "down".
   */
  inputDown: function() {
    if (this.dir.curr !== "up")
      this.dir.next = "down";
  },

  /** @function inputRight
   *  Attempts to change the direction to "right".
   */
  inputRight: function() {
    if (this.dir.curr !== "left")
      this.dir.next = "right";
  },
};

new Controller(0);
