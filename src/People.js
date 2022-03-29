import Person from './Person.js';
import * as Storage from './Storage.js';

class People {
  constructor(id, people) {
    const peopleData = [];
    for (const key in people) {
      const person = new Person(people[key].name, key, people[key].prays);
      peopleData.push(person);
    }
    this._id = id;
    this._people = peopleData;
    this._nextId = 0;
  }

  get id() {
    return this._id;
  }

  get people() {
    return this._people;
  }

  set people(people) {
    this._people = people;
  }

  async addPerson(personName) {
    const personId = Storage.getAddPersonId();
    await Storage.addPrayPerson(this.id, personId, personName);
  }

  getPerson(id) {
    return this._people.find((person) => person.id === id);
  }

  async removePerson(personId) {
    await Storage.removePerson(this.id, personId);
  }

  async setPrays(personId, prays) {
    await Storage.setPrays(this.id, personId, prays);
  }

  save() {
    localStorage.setItem('app_info', JSON.stringify(this));
  }

  async refresh() {
    const data = await Storage.getPrayRoomData(this.id);
    const people = data.people;
    const peopleData = [];
    for (const key in people) {
      const person = new Person(people[key].name, key, people[key].prays);
      peopleData.push(person);
    }
    this.people = peopleData;
  }

  get text() {
    return this.people.map((person) => person.text).join('\n\n');
  }
}

export default People;
