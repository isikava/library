/* eslint-disable max-classes-per-file */
class Book {
  constructor({ title, author, pages, isRead }) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
  }

  toggleRead() {
    this.isRead = !this.isRead;
  }
}

class Library {
  // Initialize library with an optional array of data
  constructor(dataArr) {
    if (dataArr) {
      // map it into an array of Book objects
      this.books = dataArr.map((book) => new Book(book));
    } else {
      this.books = [];
    }
  }

  addBook(book) {
    if (!book) return;
    this.books.push(book);
  }

  removeBook(index) {
    this.books.splice(index, 1);
  }

  toggleReadBook(index) {
    const book = this.books[index];
    book.toggleRead();
  }

  /**
   * Converts this model into a simple object for
   * JSON serialization
   */
  toJSON() {
    return this.books;
  }
}

const defaultData = [
  {
    title: 'The Witcher. Sword of Destiny',
    author: 'Andrzej Sapkowski',
    pages: 343,
    isRead: false,
  },
  {
    title: 'Headfirst JS',
    author: 'O. Reily',
    pages: 640,
    isRead: true,
  },
  {
    title: 'Don Quixote',
    author: 'Miguel de Cervantes',
    pages: 544,
  },
];

// Load saved books from storage
const data = localStorage.books ? JSON.parse(localStorage.getItem('books')) : defaultData;

// Create a library initializing it with the array
const library = new Library(data);

// Save to localStorage
function save() {
  localStorage.setItem('books', JSON.stringify(library));
}

// View
const booksGrid = document.querySelector('.cards-grid');

function renderData() {
  booksGrid.innerHTML = '';

  const html = library.books
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
  library.toggleReadBook(index);
  save();

  const label = card.querySelector(`label[for="btn-check-${index}"]`);
  updateText(checked ? 'Unread' : 'Read', label);
}

function handleDelete(e) {
  if (!e.target.dataset.remove) return;

  const index = +e.target.dataset.remove;
  library.removeBook(index);
  save();
  renderData();
}

booksGrid.addEventListener('click', handleDelete);
booksGrid.addEventListener('change', handleRead);

function fakeApi(book) {
  const response = {
    status: 'ok',
    message: 'ok',
  };
  const bookIndex = library.books.findIndex((el) => el.title === book.title);
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
  updateText('Now All We Need Is a Title.', feedback);

  return titleInput.checkValidity();
}

function resetForm(form) {
  const inputs = form.querySelectorAll('.form-control');
  [...inputs].forEach((input) => {
    input.parentElement.classList.remove('was-validated');
    input.classList.remove('is-invalid');
  });
  form.reset();
}

function submitForm(e) {
  e.preventDefault();

  const form = e.target;
  const isValid = validateForm(form);
  if (!isValid) return;

  const formData = new FormData(form);
  const { title, author, pages } = Object.fromEntries(formData);
  const cb = form.querySelector('#isRead');
  const titleInput = form.querySelector('#title');

  const book = new Book({ title, author, pages, isRead: cb.checked });
  const response = fakeApi(book);
  if (response.status === 'error') {
    titleInput.classList.add('is-invalid');
    titleInput.parentElement.classList.remove('was-validated');
    const titleFeedback = form.querySelector('#titleValidation');
    updateText(response.message, titleFeedback);
    return;
  }

  library.addBook(book);
  save();
  console.log(localStorage);
  resetForm(form);
  renderData();
}

const addBookForm = document.querySelector('#addBookForm');

addBookForm.setAttribute('novalidate', '');
addBookForm.addEventListener('submit', submitForm);

renderData();

const modal = document.getElementById('addBookModal');
const titleInput = document.getElementById('title');

modal.addEventListener('shown.bs.modal', () => {
  titleInput.focus();
});

const btn = document.querySelector('[data-bs-toggle="modal"]');
btn.click();
