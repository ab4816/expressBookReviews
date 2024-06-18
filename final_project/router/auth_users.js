const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  filtered_users = users.filter((user) => {
    return user.username === username;
  });
  if (filtered_users.length > 0) return true;
  else return false;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  filtered_users = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (filtered_users.length > 0) return true;
  else return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  res.type("txt");
  const username = req.body.username;
  const password = req.body.password;
  if (isValid(req.body.username)) {
    if (authenticatedUser(req.body.username, req.body.password)) {
      accessToken = jwt.sign({ data: password }, "access", {
        expiresIn: 60 * 60,
      });
      req.session.authorization = { accessToken, username };
      res.send("User Logged in");
    } else {
      res.send("Invalid Password");
    }
  } else {
    res.send("User does not exist");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  res.type("txt");
  if (books[req.params.isbn]) {
    res.type("json");

    books[req.params.isbn].reviews[req.session.authorization.username] =
      req.body.review;

    return res.status(200).send("Reviw Added");
  } else {
    return res.send("Invalid ISBN");
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  delete books[req.params.isbn].reviews[req.session.authorization.username];
  res.send("Revied Deleted");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
