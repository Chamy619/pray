import People from './People.js';

const $ = (element) => document.querySelector(element);

class App {
  constructor() {
    this.app = new People();
    this.app.load();
    this.render();
    this.initEvent();
    // eslint-disable-next-line no-undef
    this.clipboard = new ClipboardJS('.copy-button', {
      text: () => {
        return this.app.text;
      },
    });
  }

  render = () => {
    $('#app').innerHTML = `
    <ul>
    ${this.app.people
      .map(
        (person) => `
      <li class="text-lg text-gray-800 mb-2">
      ${person.name} 
      <button class="edit-pray-button px-1 text-sm hover:text-lg" data-id="${person.id}">✏️</button>
      <button class="remove-person-button px-1 text-sm hover:text-lg" data-id="${person.id}">🗑</button>
      <ul class="ml-5" style="list-style-type:'\\2728'">
        ${person.prays.map((pray) => `<li class="text-gray-600">${pray}</li>`).join('')}
      </ul>
      </li>`,
      )
      .join('')}
    </ul>
    `;
  };

  preventBodyScroll = () => {
    $('body').classList.add('overflow-y-hidden');
  };

  openAddPersonModal = () => {
    $('#add-person-modal-background').classList.remove('hidden');
    $('#add-person-input').focus();
    this.preventBodyScroll();
  };

  closeAddPersonModal = () => {
    $('#add-person-input').value = '';
    $('#add-person-modal-background').classList.add('hidden');
    $('body').classList.remove('overflow-y-hidden');
  };

  openEditPrayModal = (person) => {
    $('#edit-pray-name').innerText = person.name;
    $('#edit-pray-modal-background').classList.remove('hidden');
    this.preventBodyScroll();
    $('#edit-pray-input-box').dataset.id = person.id;
    this.drawPrayInput(person.prays);
    $('#edit-pray-input-box').querySelector('input').focus();
  };

  drawPrayInput = (prays) => {
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
  };

  closeEditPrayModal = () => {
    $('#edit-pray-modal-background').classList.add('hidden');
    $('body').classList.remove('overflow-y-hidden');
  };

  addPerson = () => {
    const name = $('#add-person-input').value;
    if (name) {
      this.app.addPerson(name);
    }
    this.closeAddPersonModal();
    this.render();
    this.app.save();
  };

  removePerson = (id) => {
    this.app.removePerson(id);
    this.render();
    this.app.save();
  };

  addPray = () => {
    $('#edit-pray-input-box').insertAdjacentHTML(
      'beforeEnd',
      `<input
      class="border-2 border-blue-500 rounded-sm w-full h-10 p-5 mb-5 last:mb-0"
      placeholder="기도제목을 입력해주세요."
    />`,
    );
    const inputs = $('#edit-pray-input-box').querySelectorAll('input');
    inputs[inputs.length - 1].focus();
  };

  clearPrayInput = () => {
    $(
      '#edit-pray-input-box',
    ).innerHTML = `<input class="border-2 border-blue-500 rounded-sm w-full h-10 p-5 mb-5 last:mb-0" placeholder="기도제목을 입력해주세요." />`;
    $('#edit-pray-input-box').querySelector('input').focus();
  };

  editPrays = (id, prays) => {
    this.app.people[id].prays = prays.map((input) => input.value).filter((pray) => !!pray);
    this.closeEditPrayModal();
    this.render();
    this.app.save();
  };

  initEvent = () => {
    $('#add-person-form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.addPerson();
    });

    $('#add-person-button').addEventListener('click', this.openAddPersonModal);

    $('#add-person-modal-background').addEventListener('click', (event) => {
      const modal = event.target.closest('#add-person-modal');
      if (!modal) {
        this.closeAddPersonModal();
      }
    });

    $('#add-person-cancel-button').addEventListener('click', this.closeAddPersonModal);

    $('#app').addEventListener('click', (event) => {
      const $editPrayButton = event.target.closest('.edit-pray-button');
      if ($editPrayButton) {
        const id = $editPrayButton.dataset.id;
        const person = this.app.getPerson(id);
        this.openEditPrayModal(person);
        return;
      }

      const $removePersonButton = event.target.closest('.remove-person-button');
      if ($removePersonButton) {
        const id = $removePersonButton.dataset.id;
        this.removePerson(id);
      }
    });

    $('#add-pray-button').addEventListener('click', this.addPray);

    $('#edit-pray-reset').addEventListener('click', this.clearPrayInput);

    $('#edit-pray-cancel-button').addEventListener('click', () => {
      this.closeEditPrayModal();
    });

    $('#edit-pray-modal-background').addEventListener('click', (event) => {
      if (!event.target.closest('#edit-pray-modal')) {
        this.closeEditPrayModal();
      }
    });

    $('#edit-pray-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const personId = $('#edit-pray-input-box').dataset.id;
      const prays = Array.from($('#edit-pray-input-box').querySelectorAll('input'));

      this.editPrays(personId, prays);
    });
  };
}

new App();
