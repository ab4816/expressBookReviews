const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  res.type("txt");
  if (username && password) {
    if (isValid(username)) {
      res.send("Username already exists");
    } else {
      users.push({ username: username, password: password });
      res.send("User Added");
    }
  } else {
    res.send("Username and/or Password not Provided");
  }
});

// Get the book list available in the shop
public_users.get("/", (req, res) => {
  //Write your code here
  let mypromise = new Promise((resolve) => {
    resolve(JSON.stringify({ books }, null, 4));
  });

  mypromise.then((successMsg) => {
    res.type("json");
    return res.status(200).send(successMsg);
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  let mypromise = new Promise((resolve, reject) => {
    const book = books[req.params.isbn];
    if (book) {
      resolve(JSON.stringify({ book }, null, 4));
    } else {
      reject("Invalid ISBN");
    }
  });

  mypromise
    .then((msg) => {
      res.type("json");
      return res.status(200).send(msg);
    })
    .catch((msg) => {
      return res.send(msg);
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  let mypromise = new Promise((resolve) => {
    const author = req.params.author;
    let filtered_books = {};
    for (let key in books) {
      if (books[key].author === author) filtered_books[key] = books[key];
    }
    resolve(JSON.stringify({ filtered_books }, null, 4));
  });

  mypromise.then((msg) => {
    res.type("json");
    return res.status(200).send(msg);
  });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let mypromise = new Promise((resolve) => {
    const title = req.params.title;
    let filtered_books = {};
    for (let key in books) {
      if (books[key].title === title) filtered_books[key] = books[key];
    }
    resolve(JSON.stringify({ filtered_books }, null, 4));
  });

  mypromise.then((msg) => {
    res.type("json");
    return res.status(200).send(msg);
  });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  let mypromise = new Promise((resolve, reject) => {
    const book = books[req.params.isbn];
    if (book) {
      const reviews = book.reviews;
      resolve(JSON.stringify({ reviews }, null, 4));
    } else {
      reject("Invalid ISBN");
    }
  });

  mypromise
    .then((msg) => {
      res.type("json");
      return res.status(200).send(msg);
    })
    .catch((msg) => {
      return res.send(msg);
    });
});

module.exports.general = public_users;
