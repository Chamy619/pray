class Person {
  constructor(name, id, prays) {
    this._name = name;
    this._id = id;
    this._prays = prays || [];
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

  get text() {
    return `${this.name}\n ${this.prays.map((pray) => `- ${pray}`)}`;
  }
}

export default Person;
