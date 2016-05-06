class MessageDispatcher {
  constructor() {
    this._events = {};
  }

  on(type, callback) {
    this._events[type] = this._events[type] || {};
    this._events[type] = callback;
  }

  emit(type, entity = null, args = null) {
    if(this._events.hasOwnProperty(type)) {
      this._events[type](entity, args);
    }
  }
}
