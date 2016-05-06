class Game {
  constructor() {
    this._entities = [];
    this._systems = [];
  }

  setup(canvas) {
    // setup game entities
    let leftPaddle = new Entity();
    leftPaddle.addComponent(
      new RenderComponent(40, 120, "black"),
      new InputComponent(81, 65),
      new VelocityComponent(0, 0),
      new PositionComponent(15, 350)
      //new CollisionComponent()
    );
    this._entities.push(leftPaddle);

    let rightPaddle = new Entity();
    rightPaddle.addComponent(
      new RenderComponent(40, 120, "black"),
      new InputComponent(38, 40),
      new VelocityComponent(0, 0),
      new PositionComponent(945, 350)
      //new CollisionComponent()
    );
    this._entities.push(rightPaddle);

    let ball = new Entity();
    ball.addComponent(
      new RenderComponent(10, 10, "black"),
      new VelocityComponent(5, 5),
      new PositionComponent(495, 285)
      //new CollisionComponent()
    );
    this._entities.push(ball);

    // setup game systems
    this._systems.push(...[
      new RenderSystem(canvas),
      new VelocitySystem(canvas),
      new InputSystem(canvas, 38, 40, 81, 65)
    ]);

    canvas.focus();
  }

  start() {
    window.requestAnimationFrame(() => this.update());
  }

  update() {
    // systems
    for(let i = 0; i < this._systems.length; i++) {
      this._systems[i].update(this._entities);
    }

    window.requestAnimationFrame(() => this.update());
  }

}
