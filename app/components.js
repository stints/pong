class Component {
  name() {
    return this.constructor.name.toLowerCase().replace('component','');
  }
}

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
  constructor(dx, dy) {
    super();
    this.dx = dx;
    this.dy = dy;
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
  constructor(upKey, downKey) {
    super();
    this.upKey = upKey;
    this.downKey = downKey;
  }
}
