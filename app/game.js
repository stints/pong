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
      //new InputComponent(),
      //new VelocityComponent(),
      new PositionComponent(15, 350)
      //new CollisionComponent()
    );
    this._entities.push(leftPaddle);

    let rightPaddle = new Entity();
    rightPaddle.addComponent(
      new RenderComponent(40, 120, "black"),
      //new InputComponent(),
      //new VelocityComponent(),
      new PositionComponent(945, 350)
      //new CollisionComponent()
    );
    this._entities.push(rightPaddle);

    // setup game systems
    this._systems.push(...[
      new RenderSystem(canvas)
    ]);
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
