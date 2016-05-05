class Component {}

class RenderComponent extends Component {
  constructor(width, height, color) {
    super();
    this.width = width;
    this.height = height;
    this.color = color;
  }
}

class CollisionComponent extends Component {}

class VelocityComponent extends Component {
  constructor() {
    super();
    this.dx = 0;
    this.dy = 0;
  }
}

class PositionComponent extends Component {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }
}

class PhysicsComponent extends Component {}

class InputComponent extends Component {
  constructor(downKey, upKey) {
    super();
    this.downKey = downKey;
    this.upKey = upKey;
  }
}
