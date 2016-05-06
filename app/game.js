class Game {
  constructor() {
    this._entities = [];
    this._systems = [];
    this._dispatch = new MessageDispatcher();
  }

  setup(canvas) {
    // setup game entities
    let ball = new Entity('ball');
    ball.addComponent(
      new RenderComponent(10, 10, 'black'),
      new VelocityComponent(5, 5),
      new PositionComponent(495, 285),
      new CollisionComponent(true)
    );
    this._entities.push(ball);

    let leftPaddle = new Entity('paddle');
    leftPaddle.addComponent(
      new RenderComponent(40, 120, 'black'),
      new InputComponent(81, 65),
      new VelocityComponent(0, 0),
      new PositionComponent(15, 350),
      new CollisionComponent(true)
    );
    this._entities.push(leftPaddle);

    let rightPaddle = new Entity('paddle');
    rightPaddle.addComponent(
      new RenderComponent(40, 120, 'black'),
      new InputComponent(38, 40),
      new VelocityComponent(0, 0),
      new PositionComponent(945, 350),
      new CollisionComponent(true)
    );
    this._entities.push(rightPaddle);

    let topBorder = new Entity('wall');
    topBorder.addComponent(
      new RenderComponent(1000, 5, 'black'),
      new PositionComponent(0, 0),
      new CollisionComponent(true)
    );
    this._entities.push(topBorder);

    let bottomBorder = new Entity('wall');
    bottomBorder.addComponent(
      new RenderComponent(1000, 5, 'black'),
      new PositionComponent(0, 575),
      new CollisionComponent(true)
    );
    this._entities.push(bottomBorder);

    // setup game systems
    this._systems.push(...[
      new RenderSystem(canvas, this._dispatch),
      new VelocitySystem(canvas, this._dispatch),
      new InputSystem(canvas, this._dispatch, 38, 40, 81, 65),
      new CollisionSystem(canvas, this._dispatch)
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
