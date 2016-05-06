class Game {
  constructor() {
    this._entities = [];
    this._systems = [];
    this._dispatch = new MessageDispatcher();

    this.rightScore = 0;
    this.leftScore = 0;
    this._scores = {};
    this._info = null; // special entity to display information

    this._play = false;
  }

  setup(canvas) {
    // setup game entities
    let ball = new Entity('ball');
    ball.addComponent(
      new RenderComponent(10, 10, 'black'),
      new VelocityComponent(0, 0),
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

    let leftWall = new Entity('wall');
    leftWall.addComponent(
      new RenderComponent(5, 570, 'black'),
      new PositionComponent(0, 5),
      new CollisionComponent(true)
    );

    let rightWall = new Entity('wall');
    rightWall.addComponent(
      new RenderComponent(5, 570, 'black'),
      new PositionComponent(995, 5),
      new CollisionComponent(true)
    );

    let leftScore = new Entity('text');
    leftScore.addComponent(
      new TextComponent('0'),
      new PositionComponent(100, 50)
    );

    let rightScore = new Entity('text');
    rightScore.addComponent(
      new TextComponent('0'),
      new PositionComponent(870, 50)
    );

    this._info = new Entity('text');
    this._info.addComponent(
      new TextComponent('Move paddle to start'),
      new PositionComponent(520, 500)
    );

    this._scores['left'] = leftScore;
    this._scores['right'] = rightScore;

    this._entities.push(
      ball,
      leftPaddle,
      rightPaddle,
      topWall,
      bottomWall,
      leftWall,
      rightWall,
      centerLine,
      leftScore,
      rightScore,
      this._info
    );

    // setup game systems
    this._systems.push(...[
      new RenderSystem(canvas, this._dispatch),
      new VelocitySystem(canvas, this._dispatch),
      new InputSystem(canvas, this._dispatch, 38, 40, 81, 65),
      new CollisionSystem(canvas, this._dispatch),
      new PositionSystem(canvas, this._dispatch),
      new TextSystem(canvas, this._dispatch)
    ]);

    // setup game events
    this._dispatch.on('score', (entity, args) => this.score(entity, args));

    canvas.focus();

    this._dispatch.on('keydown', () => this.restart());

    this.update();
  }

  restart() {
    if(!this._play) {
      this.start()
    }
  }

  start() {
    this._play = true;
    this._info.text.text = '';
    let ball = this._entities[0]; // assume first entity is ball
    this.rightScore = 0;
    this.leftScore = 0;
    this._scores['right'].text.text = this.rightScore;
    this._scores['left'].text.text = this.leftScore;
    ball.velocity.dx = 5;
    ball.velocity.dy = 5;
    window.requestAnimationFrame(() => this.update());
  }

  update() {
    // systems
    for(let i = 0; i < this._systems.length; i++) {
      this._systems[i].update(this._entities);
    }

    if(this._play) {
      window.requestAnimationFrame(() => this.update());
    }
  }

  score(entity, args) {
    if(args == 'right') {
      this.rightScore++;
      this._scores['right'].text.text = this.rightScore;
    } else if(args == 'left') {
      this.leftScore++;
      this._scores['left'].text.text = this.leftScore;
    }

    if(this.rightScore >= 10 || this.leftScore >= 10) {
      this.gameOver(entity, args);
    } else {
      this.resetBall(entity);
    }
  }

  resetBall(entity) {
    entity.position.x = 495;
    entity.position.y = 285;
    let dx = entity.velocity.dx / -entity.velocity.dx * 5;
    let dy = entity.velocity.dy / -entity.velocity.dy * 5;
    entity.velocity.dx = dx;
    entity.velocity.dy = dy;
  }

  gameOver(entity, args) {
    entity.position.x = 495;
    entity.position.y = 285;
    entity.velocity.dx = 0;
    entity.velocity.dy = 0;
    this._info.text.text = (args == 'right' ? 'Right' : 'Left') + ' Wins!';
    this._play = false;
    this.update();
  }

}
