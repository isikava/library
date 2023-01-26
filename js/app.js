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

console.table(myLibrary);
