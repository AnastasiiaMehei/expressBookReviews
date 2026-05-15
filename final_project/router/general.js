const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/booksdb'); 
    return res.status(200).send(JSON.stringify(response.data, null, 2));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
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

public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
    const result = Object.keys(books)
      .map(key => books[key])
      .filter(b => b.author.toLowerCase() === author);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author" });
  }
});

public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  new Promise((resolve) => {
    const result = Object.keys(books)
      .map(key => books[key])
      .filter(b => b.title.toLowerCase().includes(title));
    resolve(result);
  })
    .then(result => res.status(200).json(result))
    .catch(() => res.status(500).json({ message: "Error fetching books by title" }));
});

module.exports.general = public_users;
