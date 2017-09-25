import Snake from "./snake";
import Bunch from "./bunch";

class Controller {
  /** @constructor Controller
   *  Constructs a new world object for the game to take place in.
   *  @param {Integer}  highScore   The latest high score.
   */
  constructor(highScore) {
    this.cellSize = 10;
    this.width = 25;
    this.widthMax = 45
    this.height = 21;
    this.heightMax = 37;
    this.snakes = [
      new Snake({ x:Math.ceil(this.width/2)+3, y:Math.ceil(this.height/2), dir:"right" }, "red", { on:true, goalType:"closest" }, { extra:1, ignore:false }),
      new Snake({ x:Math.ceil(this.width/2)-3, y:Math.ceil(this.height/2), dir:"left" }, "purple", { on:true, goalType:"max" }, { extra:0, ignore:true })
    ];
    this.food = new Bunch([{ value:1, color:"blue" }, { value:3, color:"green" }, { value:5, color:"yellow" }]);
    this.highScore = highScore;
    // running, paused, refresh, over, reset
    this.state = "paused";
    this.speed = 600;
    this.maxSpeed = 175;

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width * this.cellSize;
    this.canvas.height = this.height * this.cellSize + 43;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = "10px Arial";

    window.onkeydown = this.handleKeyDown(this);

    this.food.placeFood(this.snakes, this.width, this.height);
    this.snakes.forEach((entity) => { entity.setGoal(this.food) });

    this.render();
    this.ctx.fillText(`Paused - Interval: ${this.speed}`, 10, (this.height + 1) * this.cellSize + 5);
  }

  /** @function handleKeyDown
   *  Handles motion input of the snake.
   *  @param  {Object} event The key down event that was triggered.
   */
  handleKeyDown(self) {
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
            case "paused":
              self.unpause();
              break;
            case "over":
              self.reset();
              break;
          }
          break;
      }
    }
  }

  /** @function render
   *  Renders the snake segments and food pellets
   */
  render() {
    // fill screen
    this.ctx.save();
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0,
      this.width * this.cellSize,
      this.width * this.cellSize + 43);
    this.ctx.restore();

    // draw directional ray from player snake
    this.ctx.save();
    this.snakes[i].renderRay(this.ctx, this.cellSize, this.width, this.height);
    this.ctx.restore();

    // draw snakes
    this.ctx.save();
    this.snakes.forEach((entity) => { entity.render(this.ctx, this.cellSize); });
    this.ctx.restore();

    // draw food pellets
    this.ctx.save();
    this.food.render();
    this.ctx.restore();

    this.ctx.fillStyle = "orange";
    this.ctx.fillText(`Your Score: ${this.snakes[0].score} - High Score: ${this.highScore} - Extra Lives: ${this.snakes[0].lives.extra}`, 10, (this.height + 1) * this.cellSize + 24);
  }

  /** @function removeSnake
   *  Removes a snake from the world if there are still more players, otherwise, ends the game.
   *  @param  {Integer} sIndex The index of the snake to remove.
   */
  removeSnake(sIndex) {
    if (this.snakes.filter((entity) => {return !entity.ai.on;}).length === 1
      || ( this.snakes.filter((entity) => {return !entity.ai.on;}).length === 0
      && this.snakes.length === 2)
    ) {
      this.state = "over";
      return;
    }

    this.snakes.splice(sIndex, 1);
  }

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
  }

  /** @function update
   *  Updates the the grame by one tick.
   */
  update() {
    var grow = [],
        die = [],
        offset = 0;

    // Steer the AI towards their goal.
    for (let i = 0; i < this.snakes.length; i++) {
      this.snakes[i].steerAI(this.snakes, this.food.loc, this.width, this.height);
    }

    // Move snakes and determine if they grow.
    for (let i = 0; i < this.snakes.length; i++) {
      this.snakes[i].updatePosition();

      if (this.snakes[i].checkEat(this.food)) {
        // Increase speed
        if (this.speed > this.maxSpeed) {
          this.speed -= 25;
          this.state = "refresh";
        }

        // If threshold met, increase screen size
        if (this.snakes[i].segments.length % 10 === 0) {
          if (this.width < this.widthMax)
            this.width++;
          if (this.height < this.heightMax)
            this.height++;
          this.canvas.width = this.width * this.cellSize;
          this.canvas.height = this.height * this.cellSize + 43;
        }

        grow.push(i);
      }
    }

    // Check if they've hit an obstacle
    for (let i = 0; i < this.snakes.length; i++) {
      if (this.checkHit(this.snakes, grow, this.width, this.height))
        die.push(i);
    }

    // Kill snakes that did hit obstacle
    die.forEach((died) => {
      if (!this.snakes[died].lives.ignore && this.snakes[died].lives.extra === 0) {
        this.removeSnake(died - offset);
        offset++;
      } else
        this.replaceSnake(died, die.length, offset);
    });

    // Replace food if it was consumed
    if (grow.length > 0) {
      this.food.clearFood();
      this.food.placeFood();

      this.snakes.forEach((entity) => { entity.setGoal(this.food) });
    }
  }

  /** @function pause
   *  Pauses the game.
   */
  pause() {
    this.state = "paused";
    clearInterval(this.loopID);
    this.render();
    this.ctx.fillText(`Paused - Interval: ${this.speed}`, 10, (this.height + 1) * this.cellSize + 5);
  }

  /** @function unpause
   *  Unpauses the game.
   */
  unpause() {
    this.state = "running";
    this.loopID = setInterval(() => this.loop(), this.speed);
    this.render();
    this.ctx.fillText(`Running - Interval: ${this.speed}`, 10, (this.height + 1) * this.cellSize + 5);
  }

  /** @function reset
   *  Restarts the entire game.
   */
  reset() {
    document.body.removeChild(this.canvas);
    new Controller(this.snakes[0].score > this.highScore ? this.snakes[0].score : this.highScore);
  }

  /** @function loop
   *  Runs a loop of updating and rendering the game.
   *  The loop is controlled by a state variable and is run with a speed variable.
   */
  loop() {
    this.update();
    this.render();

    switch (this.state) {
      case "running":
        this.ctx.fillText(`Running - Interval: ${this.speed}`, 10, (this.height + 1) * this.cellSize + 5);
        break;
      case "paused":
        this.ctx.fillText(`Paused - Interval: ${this.speed}`, 10, (this.height + 1) * this.cellSize + 5);
        break;
      case "refresh":
        clearInterval(this.loopID);
        this.state = "running";
        this.loopID = setInterval(() => this.loop(), this.speed);
        this.ctx.fillText(`Running - Interval: ${this.speed}`, 10, (this.height + 1) * this.cellSize + 5);
        break;
      case "over":
        clearInterval(this.loopID);
        this.ctx.fillText(`Game Over - Interval: ${this.speed}`, 10, (this.height + 1) * this.cellSize + 5);
        break;
    }
  }
}

new Controller(0);
