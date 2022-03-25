import Person from './Person.js';

class People {
  constructor() {
    this._people = [];
    this._nextId = 0;
  }

  get people() {
    return this._people;
  }

  addPerson(personName) {
    this._people.push(new Person(personName, this._nextId++));
  }

  getPerson(id) {
    return this._people.find((person) => person.id === Number(id));
  }

  removePerson(id) {
    this._people = this._people.filter((person) => person.id !== Number(id));
  }

  loadPerson(person) {
    this._people.push(person);
  }

  save() {
    localStorage.setItem('app_info', JSON.stringify(this));
  }

  load() {
    const appInfo = JSON.parse(localStorage.getItem('app_info'));
    if (appInfo) {
      appInfo._people.forEach((person) => {
        const newPerson = new Person(person._name, person._id);
        newPerson.prays = person._prays;
        this.loadPerson(newPerson);
      });
      this._nextId = appInfo._nextId;
    }
  }

  get text() {
    return this.people.map((person) => person.text).join('\n\n');
  }
}

export default People;
