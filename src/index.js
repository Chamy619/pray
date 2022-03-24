import Person from './Person.js';

const $ = (element) => document.querySelector(element);

class App {
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
    $('#app').innerHTML = `
      <ul>
        ${app.people
          .map((person) => `<li class="text-lg text-gray-800 mb-2">${person.name} (${person.id})</li>`)
          .join('')}
      </ul>
    `;
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
