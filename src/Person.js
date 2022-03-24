class Person {
  constructor(name, id) {
    this._name = name;
    this._id = id;
    this._prays = [];
  }

  get name() {
    return this._name;
  }

  get id() {
    return this._id;
  }

  get prays() {
    return this._prays;
  }

  set prays(prays) {
    this._prays = prays;
  }
}

export default Person;
