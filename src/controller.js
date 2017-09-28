import Snake from "./snake";
import Bunch from "./bunch";

export default class Controller {
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
      new Snake({ x:Math.ceil(this.width/2)+3, y:Math.ceil(this.height/2), dir:"right" }, "red", { on:false, goalType:"closest" }, { extra:1, ignore:false }),
      new Snake({ x:Math.ceil(this.width/2)-3, y:Math.ceil(this.height/2), dir:"left" }, "purple", { on:true, goalType:"max" }, { extra:0, ignore:true })
    ];
    this.food = new Bunch([{ value:1, color:"blue" }, { value:3, color:"green" }, { value:5, color:"yellow" }]);
    this.highScore = highScore;
    // running, paused, refresh, over, reset
    this.state = "paused";
    this.speed = 600;
    this.maxSpeed = 175;

    this.screen = document.createElement("canvas");
    this.screen.width = this.width * this.cellSize;
    this.screen.height = this.height * this.cellSize + 43;
    document.body.appendChild(this.screen);
    this.screenCTX = this.screen.getContext("2d");

    this.back = document.createElement("canvas");
    this.back.width = this.width * this.cellSize;
    this.back.height = this.height * this.cellSize + 43;
    this.backCTX = this.back.getContext("2d");
    this.backCTX.font = "10px Arial";

    window.onkeydown = this.handleKeyDown(this);

    this.food.placeFood(this.snakes, this.width, this.height);
    this.snakes.forEach((entity) => { entity.setGoal(this.food) });

    this.render(`Paused - Interval: ${this.speed}`);
  }

  /** @function handleKeyDown
   *  Handles motion input of the snake.
   *  @param  {Object} event The key down event that was triggered.
   */
  handleKeyDown(self) {
    return function(event) {
      switch (String.fromCharCode(event.keyCode)) {
        case 'W':
          self.snakes[0].tryUp();
          break;
        case 'A':
          self.snakes[0].tryLeft();
          break;
        case 'S':
          self.snakes[0].tryDown();
          break;
        case 'D':
          self.snakes[0].tryRight();
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
   *  Renders the snake segments and food pellets.
    * @param {String} debugInfo   The debug info to display.
   */
  render(debugInfo) {
    // fill screen
    this.backCTX.save();
    this.backCTX.fillStyle = "black";
    this.backCTX.fillRect(0, 0,
      this.width * this.cellSize,
      this.width * this.cellSize + 43);
    this.backCTX.restore();

    // draw directional ray from player snake
    this.backCTX.save();
    this.snakes[0].renderRay(this.backCTX, this.cellSize, this.width, this.height);
    this.backCTX.restore();

    // draw snakes
    this.backCTX.save();
    this.snakes.forEach((entity) => { entity.render(this.backCTX, this.cellSize); });
    this.backCTX.restore();

    // draw food pellets
    this.backCTX.save();
    this.food.render(this.backCTX, this.cellSize);
    this.backCTX.restore();

    this.backCTX.fillStyle = "orange";
    this.backCTX.fillText(debugInfo, 10, (this.height + 1) * this.cellSize + 24);
    this.backCTX.fillText(`Your Score: ${this.snakes[0].score} - High Score: ${this.highScore} - Extra Lives: ${this.snakes[0].lives.extra}`, 10, (this.height + 1) * this.cellSize + 5);

    this.screenCTX.drawImage(this.back, 0, 0);
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
      if (this.snakes[i].ai.on)
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
      if (this.snakes[i].checkHit(this.snakes, grow, this.width, this.height))
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
      this.food.placeFood(this.snakes, this.width, this.height);

      this.snakes.forEach((entity) => { entity.setGoal(this.food) });
    }
  }

  /** @function pause
   *  Pauses the game.
   */
  pause() {
    this.state = "paused";
    clearInterval(this.loopID);
    this.render(`Paused - Interval: ${this.speed}`);
  }

  /** @function unpause
   *  Unpauses the game.
   */
  unpause() {
    this.state = "running";
    this.loopID = setInterval(() => this.loop(), this.speed);
    this.render(`Running - Interval: ${this.speed}`);
  }

  /** @function reset
   *  Restarts the entire game.
   */
  reset() {
    document.body.removeChild(this.screen);
    new Controller(this.snakes[0].score > this.highScore ? this.snakes[0].score : this.highScore);
  }

  /** @function loop
   *  Runs a loop of updating and rendering the game.
   *  The loop is controlled by a state variable and is run with a speed variable.
   */
  loop() {
    this.update();

    switch (this.state) {
      case "running":
        this.render(`Running - Interval: ${this.speed}`);
        break;
      case "paused":
        this.render(`Paused - Interval: ${this.speed}`);
        break;
      case "refresh":
        clearInterval(this.loopID);
        this.state = "running";
        this.loopID = setInterval(() => this.loop(), this.speed);
        this.render(`Running - Interval: ${this.speed}`);
        break;
      case "over":
        clearInterval(this.loopID);
        this.render(`Game Over - Interval: ${this.speed}`);
        break;
    }
  }
}
