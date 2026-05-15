const express = require('express');
let books = require("./booksdb.js");

const public_users = express.Router();

public_users.get('/', (req, res) => {
  res.status(200).json(books);
});

// Task 11: Деталі книги за ISBN (Promise)
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) resolve(book);
    else reject("Book not found");
  })
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({ message: err }));
});

public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  const result = Object.keys(books)
    .map(key => books[key])
    .filter(b => b.author.toLowerCase() === author);
  res.status(200).json(result);
});

public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  const result = Object.keys(books)
    .map(key => books[key])
    .filter(b => b.title.toLowerCase().includes(title));
  res.status(200).json(result);
});

module.exports.general = public_users;
