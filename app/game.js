class Game {
  constructor() {
    this._entities = [];
    this._systems = [];
    this._dispatch = new MessageDispatcher();

    this.rightScore = 0;
    this.leftScore = 0;
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

    let leftPaddle = new Entity('paddle');
    leftPaddle.addComponent(
      new RenderComponent(40, 120, 'black'),
      new InputComponent(81, 65),
      new VelocityComponent(0, 0),
      new PositionComponent(15, 350),
      new CollisionComponent(true)
    );

    let rightPaddle = new Entity('paddle');
    rightPaddle.addComponent(
      new RenderComponent(40, 120, 'black'),
      new InputComponent(38, 40),
      new VelocityComponent(0, 0),
      new PositionComponent(945, 350),
      new CollisionComponent(true)
    );

    let topWall = new Entity('wall');
    topWall.addComponent(
      new RenderComponent(1000, 5, 'black'),
      new PositionComponent(0, 0),
      new CollisionComponent(true)
    );

    let bottomWall = new Entity('wall');
    bottomWall.addComponent(
      new RenderComponent(1000, 5, 'black'),
      new PositionComponent(0, 575),
      new CollisionComponent(true)
    );

    let centerLine = new Entity('scene');
    centerLine.addComponent(
      new RenderComponent(2, 580, 'black'),
      new PositionComponent(499, 0)
    );

    let leftGoal = new Entity("wall");
    leftGoal.addComponent(
      new RenderComponent(5, 570, 'black'),
      new PositionComponent(0, 5),
      new CollisionComponent(true)
    );

    let rightGoal = new Entity("wall");
    rightGoal.addComponent(
      new RenderComponent(5, 570, 'black'),
      new PositionComponent(995, 5),
      new CollisionComponent(true)
    );


    this._entities.push(
      ball,
      leftPaddle,
      rightPaddle,
      topWall,
      bottomWall,
      leftGoal,
      rightGoal,
      centerLine
    );

    // setup game systems
    this._systems.push(...[
      new RenderSystem(canvas, this._dispatch),
      new VelocitySystem(canvas, this._dispatch),
      new InputSystem(canvas, this._dispatch, 38, 40, 81, 65),
      new CollisionSystem(canvas, this._dispatch),
      new PositionSystem(canvas, this._dispatch)
    ]);

    // setup game events
    this._dispatch.on('score', (entity, args) => this.score(entity, args));

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

  score(entity, args) {
    if(args == 'right') {
      this.rightScore++;
    } else if(args == 'left') {
      this.leftScore++;
    }

    this.resetBall(entity);
    console.log('Score: ' + this.leftScore + '  ' + this.rightScore);
  }

  resetBall(entity) {
    entity.position.x = 495;
    entity.position.y = 285;
    let dx = entity.velocity.dx / -entity.velocity.dx * 5;
    let dy = entity.velocity.dy / -entity.velocity.dy * 5;
    entity.velocity.dx = dx;
    entity.velocity.dy = dy;
  }

}
