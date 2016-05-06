class System {
  constructor(canvas) {
    this._canvas = canvas;
  }

  filterEntities(filter, entities) {
    let filtered = []
    for(let i = 0; i < entities.length; i++) {
      if(entities[i].hasOwnProperty(filter.toLowerCase())) {
        filtered.push(entities[i]);
      }
    }
    return filtered;
  }
}

class RenderSystem extends System {
  constructor(canvas) {
    super(canvas);
    this._ctx = this._canvas.getContext("2d");
  }

  clearCanvas() {
    this._ctx.save();
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.restore();
  }

  // RenderSystem assumes that anything with a RenderComponent also has a PositionComponent
  update(entities) {
    var entities = this.filterEntities("Render", entities);

    this.clearCanvas();

    for(let i = 0; i < entities.length; i++) {
      // RenderComponent
      let width = entities[i].render.width;
      let height = entities[i].render.height;
      let color = entities[i].render.color;

      // PositionComponent
      let x = entities[i].position.x;
      let y = entities[i].position.y;

      this._ctx.fillStyle = color;
      this._ctx.fillRect(x, y, width, height);
    }
  }
}

class VelocitySystem extends System {
  constructor(canvas) {
    super(canvas);
  }

  // VelocitySystem assumes that anything with a VelocityComponent also has a PositionComponent
  update(entities) {
    var entities = this.filterEntities("Velocity", entities);

    for(let i = 0; i < entities.length; i++) {
      let dx = entities[i].velocity.dx;
      let dy = entities[i].velocity.dy;

      entities[i].position.x += dx;
      entities[i].position.y += dy;
    }
  }
}

class InputSystem extends System {
  constructor(canvas, ...allowedKeys) {
    super(canvas);

    this._keys = {};
    for(let key = 0; key < allowedKeys.length; key++) {
      this._keys[allowedKeys[key]] = false;
    }

    canvas.onkeydown = canvas.onkeyup = (e) => this.listener(e);
  }

  listener(e) {
    if(this._keys.hasOwnProperty(e.keyCode)) {
      this._keys[e.keyCode] = e.type == 'keydown';
    }
  }

  // InputSystem assumes that anything with an InputComponent also has a VelocityComponent
  update(entities) {
    var entities = this.filterEntities("Input", entities);

    for(let i = 0; i < entities.length; i++) {
      let upKey = entities[i].input.upKey;
      let downKey = entities[i].input.downKey;

      entities[i].velocity.dy = this._keys[upKey] ? -5 : this._keys[downKey] ? 5 : 0;
    }
  }

}
