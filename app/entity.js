let _id = 0;

class Entity {
  constructor() {
    this._id = ++_id;
  }

  addComponent(...components) {
    components.forEach(function (component) {
      if(component instanceof Component) {
        this[component.name()] = component;
      }
    }, this);
  }

  removeComponent(component) {
    let componentName = typeof component == "string" ? component : component.name();

    delete this[componentName.toLowerCase()];
  }
}
