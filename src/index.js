import People from './People.js';
import * as Storage from './Storage.js';
import '../dist/output.css';

const $ = (element) => document.querySelector(element);

const template = (title, people) => `
  <h1 class="text-3xl font-bold text-center p-5 pb-0 mb-5">${title}🙏</h1>
  <button class="copy-button absolute top-5 right-10 text-2xl">
    <i class="far fa-copy"></i>
  </button>
  <ul>
  ${people
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
  <button
      class="my-5 mx-auto w-full h-10 bg-blue-500 rounded-lg text-gray-50 hover:bg-blue-700"
      id="add-person-button"
    >
      +
  </button>
  `;

class App {
  constructor(roomId, { people, name }) {
    this.app = new People(roomId, people);
    this.render();
    this.initEvent();
    // eslint-disable-next-line no-undef
    this.clipboard = new ClipboardJS('.copy-button', {
      text: () => {
        return this.app.text;
      },
    });
    this.name = name;
  }

  render = async () => {
    await this.app.refresh();
    $('#app').innerHTML = template(this.name, this.app.people);
  };

  $input = (placeholder, value) =>
    `<input class="border-2 border-blue-500 rounded-sm w-full h-10 p-5 last:mb-0" placeholder="${placeholder}" value="${
      value || ''
    }"/>`;

  $button = () =>
    `<button type="button" class="remove-button w-6 h-6 ml-3 border-2 border-red-500 rounded-full flex items-center justify-center text-red-500 font-bold hover:border-red-700 hover:text-red-700">-</button>`;

  $inputAndRemoveButtonBox = (placeholder, pray) => {
    return `<div class="flex items-center mb-5 last:mb-0">${this.$input(placeholder, pray)}${this.$button()}</div>`;
  };

  preventBodyScroll = () => {
    $('body').classList.add('overflow-y-hidden');
  };

  enableBodyScroll = () => {
    $('body').classList.remove('overflow-y-hidden');
  };

  openAddPersonModal = () => {
    $('#add-person-modal-background').classList.remove('hidden');
    $('#add-person-input').focus();
    this.preventBodyScroll();
  };

  closeAddPersonModal = () => {
    $('#add-person-input').value = '';
    $('#add-person-modal-background').classList.add('hidden');
    this.enableBodyScroll();
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
      $('#edit-pray-input-box').innerHTML = this.$inputAndRemoveButtonBox('기도제목을 입력해주세요.');
    } else {
      $('#edit-pray-input-box').innerHTML = prays
        .map((pray) => this.$inputAndRemoveButtonBox('기도제목을 입력해주세요.', pray))
        .join('');
    }
  };

  closeEditPrayModal = () => {
    $('#edit-pray-modal-background').classList.add('hidden');
    this.enableBodyScroll();
  };

  addPerson = async () => {
    const name = $('#add-person-input').value;
    if (name) {
      await this.app.addPerson(name);
    }
    this.closeAddPersonModal();
    await this.render();
  };

  openRemovePersonModal = (person) => {
    $('#remove-person-modal-background').classList.remove('hidden');
    $('#remove-person-text').innerHTML = `<strong>${person.name}</strong> 님을 지우시겠습니까?`;
    $('#remove-person-confirm-button').dataset.id = person.id;
    this.preventBodyScroll();
  };

  closeRemovePersonModal = () => {
    $('#remove-person-modal-background').classList.add('hidden');
    this.enableBodyScroll();
  };

  removePerson = async (id) => {
    await this.app.removePerson(id);
    this.closeRemovePersonModal();
    await this.render();
  };

  addPray = () => {
    $('#edit-pray-input-box').insertAdjacentHTML(
      'beforeEnd',
      this.$inputAndRemoveButtonBox('기도제목을 입력해주세요.'),
    );
    const inputs = $('#edit-pray-input-box').querySelectorAll('input');
    inputs[inputs.length - 1].focus();
  };

  clearPrayInput = () => {
    $('#edit-pray-input-box').innerHTML = this.$inputAndRemoveButtonBox('기도제목을 입력해주세요.');
    $('#edit-pray-input-box').querySelector('input').focus();
  };

  editPrays = async (id, prays) => {
    await this.app.setPrays(
      id,
      prays.map((input) => input.value).filter((pray) => !!pray),
    );
    this.closeEditPrayModal();
    await this.render();
  };

  initEvent = () => {
    $('#add-person-form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.addPerson();
    });

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
        const person = this.app.getPerson(id);
        this.openRemovePersonModal(person);
        return;
      }

      const $addPersonButton = event.target.closest('#add-person-button');
      if ($addPersonButton) {
        this.openAddPersonModal();
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

    $('#remove-person-modal-background').addEventListener('click', (event) => {
      if (!event.target.closest('#remove-person-modal')) {
        this.closeRemovePersonModal();
      }
    });

    $('#remove-person-cancel-button').addEventListener('click', this.closeRemovePersonModal);

    $('#remove-person-confirm-button').addEventListener('click', (event) => {
      const id = event.target.dataset.id;
      this.removePerson(id);
    });

    $('#edit-pray-modal').addEventListener('click', (event) => {
      const $removeButton = event.target.closest('.remove-button');
      if ($removeButton) {
        if ($('#edit-pray-input-box').querySelectorAll('input').length > 1) {
          const $targetBox = $removeButton.closest('div');
          $targetBox.remove();
        }
        event.stopPropagation();
        return;
      }
    });
  };
}

$('#app').innerHTML = `
  <div class="absolute top-0 left-0 bg-gray-400 w-full h-full flex justify-center items-center">
    <div class="rounded-lg border-2 border-gray-700 shadow-xl bg-white w-56 flex-col p-5">
      <form id="login-form" autocomplete="off">
      <span><strong>암호를 입력해주세요.</strong></span>
      <input id="login-input" type="text" class="w-full mt-2 border-2 border-blue-500 px-2 py-1" autofocus />
      <button class="mt-2 bg-blue-500 text-white px-3 py-1 rounded-sm w-full" >확인</button>
      <span id="login-error-message" class="text-red-500 text-sm"></span>
      </form>
    </div>
  </div>
`;

$('#app').addEventListener('submit', async (event) => {
  const $loginForm = event.target.closest('#login-form');
  if ($loginForm) {
    event.preventDefault();
    const $loginInput = $('#login-input');
    const id = $loginInput.value;
    const data = await Storage.getPrayRoomData(id);
    if (id && data) {
      new App(id, data);
    } else {
      $('#login-error-message').innerText = '암호를 확인해주세요';
    }
  }
});
