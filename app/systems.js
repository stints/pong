class System {
  constructor(canvas, dispatch) {
    this._canvas = canvas;
    this.dispatch = dispatch;
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
  constructor(canvas, dispatch) {
    super(canvas, dispatch);
    this._ctx = this._canvas.getContext('2d');
  }

  clearCanvas() {
    this._ctx.save();
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.restore();
  }

  // RenderSystem assumes that anything with a RenderComponent also has a PositionComponent
  update(entities) {
    var entities = this.filterEntities('Render', entities);

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
  constructor(canvas, dispatch) {
    super(canvas, dispatch);
  }

  // VelocitySystem assumes that anything with a VelocityComponent also has a PositionComponent
  update(entities) {
    var entities = this.filterEntities('Velocity', entities);

    for(let i = 0; i < entities.length; i++) {
      let dx = entities[i].velocity.dx;
      let dy = entities[i].velocity.dy;

      entities[i].position.x += dx;
      entities[i].position.y += dy;
    }
  }
}

class InputSystem extends System {
  constructor(canvas, dispatch, ...allowedKeys) {
    super(canvas, dispatch);

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
    var entities = this.filterEntities('Input', entities);

    for(let i = 0; i < entities.length; i++) {
      let upKey = entities[i].input.upKey;
      let downKey = entities[i].input.downKey;

      entities[i].velocity.dy = this._keys[upKey] ? -5 : this._keys[downKey] ? 5 : 0;
    }
  }

}

class CollisionSystem extends System {
  constructor(canvas, dispatch) {
    super(canvas, dispatch);
  }

  intersect(entity1, entity2) {
    return entity1.position.x < entity2.position.x + entity2.render.width &&
            entity1.position.x + entity1.render.width > entity2.position.x &&
            entity1.position.y < entity2.position.y + entity2.render.height &&
            entity1.position.y + entity1.render.height > entity2.position.y;
  }

  // CollisionSystem assumes that anything with an CollisionComponent also has a PositionComponent
  update(entities) {
    var entities = this.filterEntities('Collision', entities);

    for(let i = 0; i < entities.length; i++) {
      let remainingEntities = entities.slice(i + 1);
      for(let j = 0; j < remainingEntities.length; j++) {
        if(entities[i] === remainingEntities[j]) {
          continue;
        }

        if(this.intersect(entities[i], remainingEntities[j])) {
          let dx = 0;
          let dy = 0;

          if(remainingEntities[j].name == 'wall') {
            if(entities[i].name == 'ball') {
              dx = 1;
              dy = -1;
            } else if(entities[i].name == 'paddle') {
              dx = 0;
              dy = 0;
              let wHeight = remainingEntities[j].render.height;
              let eHeight = entities[i].render.height;
              let wY = remainingEntities[j].position.y;
              let eY = entities[i].position.y;
              if(wY + wHeight - 5 <= eY) {
                entities[i].position.y += 1;
              }
              if(wY + 5 >= eY + eHeight) {
                entities[i].position.y -= 1;
              }

            }
          } else if(remainingEntities[j].name == 'paddle') {
            if(entities[i].name == 'ball') {
              dx = -1;
              dy = 1;
              if(remainingEntities[j].velocity.dy > 0) {
                dx = -1.2;
              }
            }
          }

          entities[i].velocity.dx *= dx;
          entities[i].velocity.dy *= dy;
        }
      }
    }
  }
}

class PositionSystem extends System {
  constructor(canvas, dispatch) {
    super(canvas, dispatch);
  }

  update(entities) {
    var entities = this.filterEntities('Position', entities);

    for(let i = 0; i < entities.length; i++) {
      // check for ball crossing score
      if(entities[i].name == 'ball') {
        let x = entities[i].position.x;

        if(x < 30) { // right player scores on left
          this.dispatch.emit('score', entities[i], 'right');
        } else if(x > 970) { // left player scores on right
          this.dispatch.emit('score', entities[i], 'left');
        }
      }
    }
  }
}

class TextSystem extends System {
  constructor(canvas, dispatch) {
    super(canvas, dispatch);
    this._ctx = this._canvas.getContext('2d');
  }

  // TextSystem assumes that anything with an TextComponent also has a PositionComponent
  update(entities) {
    var entities = this.filterEntities('Text', entities);

    for(let i = 0; i < entities.length; i++) {
      this._ctx.font = '30px Arial';
      this._ctx.fillText(entities[i].text.text, entities[i].position.x, entities[i].position.y);
    }
  }
}
