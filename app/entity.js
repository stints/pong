class Entity {
  constructor() {
    this._id = 0; //TODO: setup id
  }

  addComponent(component) {
    if(component instanceof Component) {
      this[component.constructor.name.toLowerCase()] = component;
    } else {
      throw("Argument is not an instance of class 'Component'");
    }
  }

  removeComponent(component) {
    let componentName = typeof component == "string" ? component : component.constructor.name;

    delete this[componentName.toLowerCase()];
  }
}
