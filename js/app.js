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

const book1 = new Book('Witcher', 'A. Sapkovsky', 123, false);
const book2 = new Book('Headfirst JS', 'O. Reily', 999, true);
addBook(book1);
addBook(book2);

const booksGrid = document.querySelector('.cards-grid');

function getCardElement(book) {
  const card = document.createElement('div');
  card.className = 'card rounded-3 shadow-sm';
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body fs-5';
  cardBody.textContent = `${book.title} by ${book.author}`;
  card.append(cardBody);
  return card;
}

function renderData() {
  booksGrid.innerHTML = '';
  myLibrary.forEach((book) => {
    const card = getCardElement(book);
    booksGrid.append(card);
  });
}

const btn = document.querySelector('[data-bs-toggle="modal"]');
btn.click();

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
