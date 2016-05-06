class MessageDispatcher {
  constructor() {
    this._events = {};
  }

  on(type, callback) {
    this._events[type] = this._events[type] || {};
    this._events[type] = callback;
  }

  emit(type, entity, args = {}) {
    if(this._events.hasOwnProperty(type)) {
      this._events[type](entity, args);
    }
  }
}
