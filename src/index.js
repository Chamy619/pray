import Person from './Person.js';

const $ = (element) => document.querySelector(element);

class App {
  constructor() {
    this._people = [];
  }

  id = 0;

  get people() {
    return this._people;
  }

  addPerson(personName) {
    this._people.push(new Person(personName, this.id++));
  }
}

function init() {
  const app = new App();
  app.addPerson('김단비');
  app.addPerson('신지수');
  app.addPerson('박규선');
  app.addPerson('서경원');
  app.addPerson('엄유진');
  app.addPerson('박희원');
  app.addPerson('백화평');
  app.addPerson('양채훈');
  const render = () => {
    $('#app').innerHTML = app.people.map((person) => `<li>${person.name} (${person.id})</li>`).join('');
  };

  render();

  $('#add-person-button').addEventListener('click', () => {
    const name = prompt('기도할 사람 이름을 입력해주세요.');
    if (name) {
      app.addPerson(name);
      render();
    }
  });
}

init();
