export default class Snake {
  /** @constructor Snake
   *  Constructs a new snake object.
   */
  constructor(spawn, color, ai = { on:false, goalType:"random", goal:0 }, lives = { extra:0, ignore:false }, score = 0) {
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

  /** @function findClosest
   *  Returns the index of the food piece closes to the head of the provided snake.
   *  @param  {Object} head     The head of the snake to use.
   *  @return {Integer}         The index of the food pellet closest to the snake.
   */
  findClosest(food) {
    var head = this.segments[0];
    var distances = [];

    food.forEach((pellet) => {
      distances.push(Math.abs(head.x - pellet.x) + Math.abs(head.y - pellet.y));
    });

    return distances.indexOf(Math.min.apply(null, distances));
  }

  /** @function setGoal
   *  Update the goal of the AI.
   */
  setGoal(food) {
    if (this.ai.on) {
      switch (this.ai.goalType) {
        case "closest":
          this.ai.goal = this.findClosest(food.loc);
          break;
        case "last":
          this.ai.goal = food.loc.length - 1;
          break;
        case "random":
          this.ai.goal = Math.round(Math.random() * (food.loc.length - 1));
          break;
      }
    }
  }

  /** @function tryUp
   *  Attempts to change the direction to "up".
   */
  tryUp() {
    if (this.dir.curr === "down")
      return false;

    this.dir.next = "up";
    return true;
  }

  /** @function tryLeft
   *  Attempts to change the direction to "left".
   */
  tryLeft() {
    if (this.dir.curr === "right")
      return false;

    this.dir.next = "left";
    return true;
  }

  /** @function tryDown
   *  Attempts to change the direction to "down".
   */
  tryDown() {
    if (this.dir.curr === "up")
      return false;

    this.dir.next = "down";
    return true;
  }

  /** @function tryRight
   *  Attempts to change the direction to "right".
   */
  tryRight() {
    if (this.dir.curr === "left")
      return false;

    this.dir.next = "right";
    return true;
  }

  /** @function steerAI
   *  Calculates a move for the AI.
   */
  steerAI(snakes, food, width, height) {
    var x, y,
      tail = this.segments.pop(),
      dir = { up:true, left:true, down:true, right:true },
      pellet = food[this.ai.goal];

    for (let j = 0; j < 4; j++) {
      x = this.segments[0].x;
      y = this.segments[0].y;

      if (x > pellet.x) {
        if (
          !((dir["left"] && this.tryLeft()) ||
          (y > pellet.y && dir["up"] && this.tryUp()) ||
          (y < pellet.y && dir["down"] && this.tryDown())) &&
          !((dir["up"] && this.tryUp()) ||
          (dir["down"] && this.tryDown()))
        )
          this.dir.next = "right";
      } else if (x < pellet.x) {
        if (
          !((dir["right"] && this.tryRight()) ||
          (y > pellet.y && dir["up"] && this.tryUp()) ||
          (y < pellet.y && dir["down"] && this.tryDown())) &&
          !((dir["down"] && this.tryDown()) ||
          (dir["up"] && this.tryUp()))
        )
          this.dir.next = "left";
      } else {
        if (y > pellet.y) {
          if (
            !((dir["up"] && this.tryUp()) ||
            (dir["right"] && this.tryRight()) ||
            (dir["left"] && this.tryLeft()))
          )
            this.dir.next = "down";
        } else if (y < pellet.y) {
          if (
            !((dir["down"] && this.tryDown()) ||
            (dir["left"] && this.tryLeft()) ||
            (dir["right"] && this.tryRight()))
          )
            this.dir.next = "up";
        } else {
          if (
            !((dir["up"] && this.tryUp()) ||
            (dir["right"] && this.tryRight()) ||
            (dir["down"] && this.tryDown()) ||
            (dir["left"] && this.tryLeft()))
          ) {
            this.segments.push(tail);
            return;
          }
        }
      }

      switch(this.dir.next) {
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
        x < 0 || y < 0 || x >= width || y >= height ||
        snakes.find((entity) => {
          return entity.segments.find((segment) => {
            return segment.x === x && segment.y === y;
          });
        })
      ) {
        dir[this.dir.next] = false;
      } else {
        this.segments.push(tail);
        return;
      }
    }
    this.segments.push(tail);
  }

  /** @function updatePosition
   *  Moves the snake in the direction it is heading.
   */
  updatePosition() {
    var x = this.segments[0].x;
    var y = this.segments[0].y;

    // Update direction that snake is moving
    this.dir.curr = this.dir.next;

    // Move snake in direction
    switch(this.dir.curr) {
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

    // Give snake head at new location
    this.segments.unshift({ x:x, y:y });
  }

  /** @function checkEat
   *  Determine if the snake has eaten food.
   *  @param  {Bunch} food  The food present.
   *  @return {Boolean}     Whether or not the snake ate.
   */
  checkEat(food) {
    var x = this.segments[0].x;
    var y = this.segments[0].y;
    var pellet;

    // Determine if snake has hit food
    for (let j = 0; j < food.loc.length; j++) {
      pellet = food.eatFood(x, y);
      if (pellet) {
        this.score += pellet.value;

        if (!this.lives.ignore && (this.segments.length- 1) % (30 * 2 ** this.lives.extra) === 0)
          this.lives.extra++;

        return true;
      }
    }

    this.segments.pop();

    return false;
  }

  /** @function checkHit
   *  Determine if the snake has eaten shit.
   *  @param  {Array} snakes    The snakes present in the world.
   *  @param  {Array} grow      The snakes that have grown.
   *  @param  {Integer} width   The width of the world.
   *  @param  {Integer} height  The height of the world.
   *  @return {Boolean}         Whether or not the snake has died.
   */
  checkHit(snakes, grow, width, height) {
    var head = this.segments.shift();
    var tails = {};

    for (let j = 0; j < snakes.length; j++) {
      if (!grow.includes(j))
        tails[j] = snakes[j].segments.pop();
    }

    if (
      head.x < 0 || head.y < 0 || head.x >= width || head.y >= height ||
      snakes.find((entity) => {
        return entity.segments.find((segment) => {
          return segment.x === head.x && segment.y === head.y;
        });
      })
    ) {
      this.segments.unshift(head);

      for (let j = 0; j < snakes.length; j++) {
        if (!grow.includes(j))
          snakes[j].segments.push(tails[j]);
      }

      return true;
    }
    this.segments.unshift(head);

    for (let j = 0; j < snakes.length; j++) {
      if (!grow.includes(j))
        snakes[j].segments.push(tails[j]);
    }

    return false;
  }

  /** @function render
   *  Renders the snake on the supplied canvas context.
   *  @param  {Context} ctx      The canvas context to draw onto.
   *  @param  {Integer} cellSize The size of each cell of the world.
   */
  render(ctx, cellSize) {
    var head = this.segments[0];
    var last = this.segments.length - 1;

    ctx.fillStyle = this.color;

    this.segments.slice(1, last).forEach((segment) => {
      ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
    });
    ctx.beginPath();
    ctx.arc((this.segments[last].x + 0.5) * cellSize, (this.segments[last].y + 0.5) * cellSize, cellSize / 2, 0, 2 * Math.PI, true);
    ctx.fill();

    switch(this.dir.curr) {
      case "up":
        ctx.fillRect(head.x * cellSize, (head.y + 0.5) * cellSize, cellSize, cellSize / 2);
        ctx.beginPath();
        ctx.arc((head.x + 0.5) * cellSize, (head.y + 0.5) * cellSize, cellSize / 2, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.fillRect(head.x * cellSize + 2, (head.y + 1) * cellSize - 5, 3, 2);
        ctx.fillRect((head.x + 1) * cellSize - 5, (head.y + 1) * cellSize - 5, 3, 2);
        break;
      case "left":
        ctx.fillRect((head.x + 0.5) * cellSize, head.y * cellSize, cellSize / 2, cellSize);
        ctx.beginPath();
        ctx.arc((head.x + 0.5) * cellSize, (head.y + 0.5) * cellSize, cellSize / 2, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.fillRect((head.x + 1) * cellSize - 5, head.y * cellSize + 2, 2, 3);
        ctx.fillRect((head.x + 1) * cellSize - 5, (head.y + 1) * cellSize - 5, 2, 3);
        break;
      case "down":
        ctx.fillRect(head.x * cellSize, head.y * cellSize, cellSize, cellSize / 2);
        ctx.beginPath();
        ctx.arc((head.x + 0.5) * cellSize, (head.y + 0.5) * cellSize, cellSize / 2, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.fillRect(head.x * cellSize + 2, head.y * cellSize + 3, 3, 2);
        ctx.fillRect((head.x + 1) * cellSize - 5, head.y * cellSize + 3, 3, 2);
        break;
      case "right":
        ctx.fillRect(head.x * cellSize, head.y * cellSize, cellSize / 2, cellSize);
        ctx.beginPath();
        ctx.arc((head.x + 0.5) * cellSize, (head.y + 0.5) * cellSize, cellSize / 2, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.fillRect(head.x * cellSize + 3, head.y * cellSize + 2, 2, 3);
        ctx.fillRect(head.x * cellSize + 3, (head.y + 1) * cellSize - 5, 2, 3);
        break;
    }
  }

  /** @function renderRay
   *  Renders a ray from this snake in the direction they're facing to the edge.
   *  @param  {Context}   ctx      The canvas context to render on.
   *  @param  {Integer}   cellSize The size of the each cell in the world.
   *  @param  {[Integer]} width    The total width of the world.
   *  @param  {[Integer]} height   The total height of the world.
   */
  renderRay(ctx, cellSize, width, height) {
    var sX = this.segments[0].x * cellSize + cellSize / 2;
    var sY = this.segments[0].y * cellSize + cellSize / 2;

    ctx.strokeStyle = "white"

    switch(this.dir.curr) {
      case "up":
        ctx.beginPath();
        ctx.moveTo(sX, sY);
        ctx.lineTo(sX, 0);
        ctx.stroke();
        break;
      case "left":
        ctx.beginPath();
        ctx.moveTo(sX, sY);
        ctx.lineTo(0, sY);
        ctx.stroke();
        break;
      case "down":
        ctx.beginPath();
        ctx.moveTo(sX, sY);
        ctx.lineTo(sX, height * cellSize - 1);
        ctx.stroke();
        break;
      case "right":
        ctx.beginPath();
        ctx.moveTo(sX, sY);
        ctx.lineTo(width * cellSize - 1, sY);
        ctx.stroke();
        break;
    }
  }
}
