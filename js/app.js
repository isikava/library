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
addBook();

// console.table(myLibrary);

const booksGrid = document.querySelector('.cards-grid');

myLibrary.forEach((book, i) => {
  console.log(i);
  const card = document.createElement('div');
  card.className = 'card rounded-3 shadow-sm';
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body fs-5';
  cardBody.textContent = `${book.title} by ${book.author}`;
  card.append(cardBody);
  booksGrid.append(card);
});
