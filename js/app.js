const myLibrary = [];

function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

Book.prototype.toggleRead = function () {
  this.isRead = !this.isRead;
};

function addBook(book) {
  if (!book) return;
  myLibrary.push(book);
}

function removeBook(index) {
  myLibrary.splice(index, 1);
}

function toggleReadBook(index) {
  const book = myLibrary[index];
  book.toggleRead();
}

const book1 = new Book('The Witcher. Sword of Destiny', 'Andrzej Sapkowski', 343, false);
const book2 = new Book('Headfirst JS', 'O. Reily', 640, true);
addBook(book1);
addBook(book2);

const booksGrid = document.querySelector('.cards-grid');

function renderData() {
  booksGrid.innerHTML = '';

  const html = myLibrary
    .map(
      (book, index) => `
      <div class="card rounded-3 shadow-sm">
        <div class="card-body fs-5">
          <h3 class="card-title">${book.title}</h3>
          <p>by ${book.author}</p>
          <p>Pages: ${book.pages}</p>
          <span>Status: <span class="isRead">
          ${book.isRead ? 'Read' : 'Not read'}</span> 
          </span>
        </div>
        <div class="card-footer bg-transparent border-top-0">
          <input
            type="checkbox"
            class="btn-check"
            id="btn-check-${index}"
            value="isRead"
            autocomplete="off"
            data-toggle="${index}"
            ${book.isRead ? 'checked' : ''}
          />
          <label
            class="w-100 mb-3 btn btn-lg btn-outline-success"
            for="btn-check-${index}"
            >${book.isRead ? 'Unread' : 'Read'}</label
          ><br />
          <button
            type="button"
            class="w-100 btn btn-lg btn-secondary"
            data-remove="${index}"
          >
            Remove
          </button>
        </div>
      </div>`
    )
    .join(' ');

  booksGrid.innerHTML = html;
}

/* eslint no-param-reassign: ["error", { "props": false }] */
function updateText(text, node) {
  if (!node) return;

  node.textContent = text;
}

function handleRead(e) {
  if (e.target.value !== 'isRead') return;

  const cb = e.target;
  const { checked } = cb;
  const card = cb.parentElement.parentElement;
  const span = card.querySelector('span.isRead');
  updateText(checked ? 'Read' : 'Not read', span);

  const index = +cb.dataset.toggle;
  toggleReadBook(index);

  const label = card.querySelector(`label[for="btn-check-${index}"]`);
  updateText(checked ? 'Unread' : 'Read', label);
}

function handleDelete(e) {
  if (!e.target.dataset.remove) return;

  const index = +e.target.dataset.remove;
  removeBook(index);
  renderData();
}

booksGrid.addEventListener('click', handleDelete);
booksGrid.addEventListener('change', handleRead);

function fakeApi(book) {
  const response = {
    status: 'ok',
    message: 'ok',
  };
  const bookIndex = myLibrary.findIndex((el) => el.title === book.title);
  if (bookIndex >= 0) {
    response.status = 'error';
    response.message = 'This Book is already in the library.';
  }

  return response;
}

function validateForm(formEl) {
  const titleInput = formEl.querySelector('#title');
  titleInput.classList.remove('is-invalid');
  titleInput.parentElement.classList.add('was-validated');
  const feedback = formEl.querySelector('#titleValidation');
  feedback.textContent = 'Now All We Need Is a Title.';

  return titleInput.checkValidity();
}

function submitForm(e) {
  e.preventDefault();

  const form = e.target;
  const isValid = validateForm(form);
  if (!isValid) return;

  const formData = new FormData(form);
  const { title, author, pages } = Object.fromEntries(formData);
  const cb = form.querySelector('#isRead');

  const book = new Book(title, author, pages, cb.checked);
  const response = fakeApi(book);
  if (response.status === 'error') {
    const titleInput = form.querySelector('#title');
    titleInput.classList.add('is-invalid');
    titleInput.parentElement.classList.remove('was-validated');
    const feedback = form.querySelector('#titleValidation');
    feedback.textContent = response.message;
    return;
  }

  addBook(book);
  form.reset();
  renderData();
}

const addBookForm = document.querySelector('#addBookForm');

addBookForm.setAttribute('novalidate', '');
addBookForm.addEventListener('submit', submitForm);

renderData();

const btn = document.querySelector('[data-bs-toggle="modal"]');
btn.click();
