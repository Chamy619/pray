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

  getPerson(id) {
    return this._people[id];
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
}

function init() {
  const app = new App();
  app.load();

  const render = () => {
    $('#app').innerHTML = `
      <ul>
        ${app.people
          .map(
            (person) => `
          <li class="text-lg text-gray-800 mb-2">
          ${person.name} <button class="edit-pray-button text-sm" data-id="${person.id}">✏️</button>
          <ul class="ml-5" style="list-style-type:'\\2728'">
            ${person.prays.map((pray) => `<li class="text-gray-600">${pray}</li>`).join('')}
          </ul>
          </li>`,
          )
          .join('')}
      </ul>
    `;
  };

  render();

  const closeAddPersonModal = () => {
    $('#add-person-input').value = '';
    $('#add-person-modal-background').classList.add('hidden');
    $('body').classList.remove('overflow-y-hidden');
  };

  const closeEditPrayModal = () => {
    $('#edit-pray-modal-background').classList.add('hidden');
    $('body').classList.remove('overflow-y-hidden');
  };

  $('#add-person-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = $('#add-person-input').value;
    if (name) {
      app.addPerson(name);
    }
    closeAddPersonModal();
    render();
    app.save();
  });

  $('#add-person-button').addEventListener('click', () => {
    $('#add-person-modal-background').classList.remove('hidden');
    $('#add-person-input').focus();
    $('body').classList.add('overflow-y-hidden');
  });

  $('#add-person-modal-background').addEventListener('click', (event) => {
    const modal = event.target.closest('#add-person-modal');
    if (!modal) {
      closeAddPersonModal();
    }
  });

  $('#add-person-cancel-button').addEventListener('click', () => {
    closeAddPersonModal();
  });

  $('#app').addEventListener('click', (event) => {
    const $editPrayButton = event.target.closest('.edit-pray-button');
    if ($editPrayButton) {
      $('#edit-pray-modal-background').classList.remove('hidden');

      const id = $editPrayButton.dataset.id;
      const person = app.getPerson(id);
      const prays = person.prays;

      $('#edit-pray-name').innerText = person.name;

      if (!prays.length) {
        $(
          '#edit-pray-input-box',
        ).innerHTML = `<input class="border-2 border-blue-500 rounded-sm w-full h-10 p-5 mb-5 last:mb-0" placeholder="기도제목을 입력해주세요." />`;
      } else {
        $('#edit-pray-input-box').innerHTML = prays
          .map(
            (pray) => `<input
            class="border-2 border-blue-500 rounded-sm w-full h-10 p-5 mb-5 last:mb-0"
            placeholder="기도제목을 입력해주세요."
            value="${pray}"
          />`,
          )
          .join('');
      }

      $('#edit-pray-input-box').querySelector('input').focus();
      $('#edit-pray-input-box').dataset.id = id;
      $('body').classList.add('overflow-y-hidden');
    }
  });

  $('#add-pray-button').addEventListener('click', () => {
    $('#edit-pray-input-box').insertAdjacentHTML(
      'beforeEnd',
      `<input
      class="border-2 border-blue-500 rounded-sm w-full h-10 p-5 mb-5 last:mb-0"
      placeholder="기도제목을 입력해주세요."
    />`,
    );
    const inputs = $('#edit-pray-input-box').querySelectorAll('input');
    inputs[inputs.length - 1].focus();
  });

  $('#edit-pray-reset').addEventListener('click', () => {
    $(
      '#edit-pray-input-box',
    ).innerHTML = `<input class="border-2 border-blue-500 rounded-sm w-full h-10 p-5 mb-5 last:mb-0" placeholder="기도제목을 입력해주세요." />`;
    $('#edit-pray-input-box').querySelector('input').focus();
  });

  $('#edit-pray-cancel-button').addEventListener('click', () => {
    closeEditPrayModal();
  });

  $('#edit-pray-modal-background').addEventListener('click', (event) => {
    if (!event.target.closest('#edit-pray-modal')) {
      closeEditPrayModal();
    }
  });

  $('#edit-pray-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const personId = $('#edit-pray-input-box').dataset.id;
    const prays = Array.from($('#edit-pray-input-box').querySelectorAll('input'));

    app.people[personId].prays = prays.map((input) => input.value).filter((pray) => !!pray);
    closeEditPrayModal();
    render();
    app.save();
  });
}

init();
