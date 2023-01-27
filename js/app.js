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

const book1 = new Book(
  'The Witcher. Sword of Destiny',
  '	Andrzej Sapkowski',
  343,
  false
);
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

function submitForm(e) {
  e.preventDefault();
  const { target } = e;

  const formData = new FormData(target);
  const { title, author, pages } = Object.fromEntries(formData);
  const cb = target.querySelector('#isRead');

  const book = new Book(title, author, pages, cb.checked);
  addBook(book);
  renderData();
}

const addBookForm = document.querySelector('#addBookForm');

addBookForm.addEventListener('submit', submitForm);

renderData();

const btn = document.querySelector('[data-bs-toggle="modal"]');
btn.click();
