class Person {
  constructor(name, id) {
    this._name = name;
    this._id = id;
    this._pray = [];
  }

  get name() {
    return this._name;
  }

  get id() {
    return this._id;
  }

  get pray() {
    return this._pray;
  }
}

export default Person;
