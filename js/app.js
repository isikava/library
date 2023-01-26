const myLibrary = [];

function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

function addBook(book) {
  if (!book) return;
  myLibrary.push(book);
}

function removeBook(index) {
  myLibrary.splice(index, 1);
}

const book1 = new Book('Witcher', 'A. Sapkovsky', 123, false);
const book2 = new Book('Headfirst JS', 'O. Reily', 999, true);
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
          <span>Status: ${book.isRead ? 'Read' : 'Not read'}</span>
        </div>
        <div class="card-footer bg-transparent border-top-0">
          <input
            type="checkbox"
            class="btn-check"
            id="check-${index}"
            autocomplete="off"
          />
          <label
            class="w-100 mb-3 btn btn-lg btn-outline-success"
            for="check-${index}"
            >Read</label
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

function handleDelete(e) {
  if (!e.target.dataset.remove) return;
  const index = +e.target.dataset.remove;
  removeBook(index);
  renderData();
}

booksGrid.addEventListener('click', handleDelete);

const btn = document.querySelector('[data-bs-toggle="modal"]');
// btn.click();

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
