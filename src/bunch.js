export default class Bunch {
  /** @constructor
   *  Creates an empty bunch of food with a set of possible values.
   *  @param  {Array} types The available types of food.
   */
  constructor(types) {
    this.typ = types;
    this.loc = [];
  }

  /** @function clearFood
   *  Clears the locations of all pieces of food.
   */
  clearFood() {
    this.loc = [];
  }

  /** @function placeFood
   *  Places one of each type of food in a place that is not currently occupied.
   */
  placeFood(snakes, width, height) {
    this.typ.forEach((foodType) => {
      var x = Math.floor(Math.random() * (width - 2) + 1);
      var y = Math.floor(Math.random() * (height - 2) + 1);

      while (snakes.find((entity) => {
          return entity.segments.find((segment) => {
            return segment.x === x && segment.y === y;
          });
        }) || this.loc.find((pellet) => {
          return pellet.x === x && pellet.y === y;
        })
      ) {
        x = Math.floor(Math.random() * (width - 2) + 1);
        y = Math.floor(Math.random() * (height - 2) + 1);
      }

      this.loc.push({ x:x, y:y });
    });
  }

  /** @function render
   *  Renders all the food on the cupplied canvas context.
   *  @param  {Context} ctx      The canvas context to draw on.
   *  @param  {Integer} cellSize The size of each cell in the world.
   */
  render(ctx, cellSize) {
    for (let j = 0; j < this.typ.length; j++) {
      ctx.fillStyle = this.typ[j].color;

      ctx.fillRect(
        this.loc[j].x * cellSize, this.loc[j].y * cellSize,
        cellSize, cellSize
      );
    }
  }
}
