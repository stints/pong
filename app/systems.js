class System {
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
    super();
    this._canvas = canvas;
    this._ctx = canvas.getContext("2d");
  }

  clearCanvas() {
    this._ctx.save();
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.restore();
  }

  // RenderSystem assumes that anything with a RenderComponent also has a PositionComponent
  update(entities) {
    var entities = this.filterEntities("RenderComponent", entities);

    this.clearCanvas();

    for(let i = 0; i < entities.length; i++) {
      // RenderComponent
      let width = entities[i].rendercomponent.width;
      let height = entities[i].rendercomponent.height;
      let color = entities[i].rendercomponent.color;

      // PositionComponent
      let x = entities[i].positioncomponent.x;
      let y = entities[i].positioncomponent.y;

      this._ctx.fillStyle = color;
      this._ctx.fillRect(x, y, width, height);
    }
  }
}
