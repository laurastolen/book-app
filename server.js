/* eslint-disable camelcase */
'use strict';

const express = require('express');
const app = express();
require('ejs');
require('dotenv').config();
const methodOverride = require('method-override');

const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);

const superagent = require('superagent');
const PORT = process.env.PORT || 3001;

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(methodOverride('_method'));

client.on('error', err => {
  console.error(err);
});

const bookshelfOptions = ["All", "Fiction", "Non-Fiction", "Sci-Fi", "Romance", "Children's Books", "Fantasy"]

//Get Book Data
app.get('/', getSavedBooks);
app.get('/searchPage', getSearchPage);
app.get('/books/:isbn', getBookByIsbn);
app.post('/searches', getBooks);

//Insert Book Data
app.post('/books/insert', insertBook);

//Update Book Data
app.put('/books/updatebook', updateBook);

//Delete Book Data
app.delete('/books/deleteBook', deleteBook)

app.get('*', (request, response) => {
  response.render('pages/error');
});

function deleteBook(request, response) {
  let book = request.body
  let sql = 'DELETE FROM books WHERE isbn=$1;';
  let safeValue = [book.isbn];
  client.query(sql, safeValue)
  response.redirect('/')
}

function updateBook(request, response) {
  let book = request.body
  let sql = 'UPDATE books SET title=$1, description=$2, author=$3, bookshelf=$4 WHERE isbn=$5;';
  let safeValue = [book.title, book.description, book.author, book.bookshelf, book.isbn,];
  client.query(sql, safeValue)
  response.redirect('/')
}

function insertBook(request, response) {
  let book = request.body
  let sql = 'INSERT INTO books (title, description, author, isbn, bookshelf, image_url) VALUES($1, $2, $3, $4, $5, $6);';
  let safeValues = [book.title, book.description, book.author, book.isbn, book.bookshelf, book.image_url];
  client.query(sql, safeValues)
  response.redirect('/')
}

function getBookByIsbn(request, response) {
  let isbn = request.params.isbn;

  let sql = 'SELECT * FROM books WHERE isbn = $1;';
  let safeValues = [isbn];

  client.query(sql, safeValues)
    .then(results => {
      let selectedBook = results.rows[0];
      response.render('pages/details', {
        bookDetails: selectedBook,
        bookshelves: bookshelfOptions
      });
    })
    .catch((err) => { console.log(err); response.render('pages/error') });
}

function getSearchPage(request, response) {
  response.render('pages/searchPage')
}

function getSavedBooks(request, response) {
  let sql = 'SELECT * FROM books WHERE title IS NOT NULL;';
  let safeValues = [];

  let books = []
  client.query(sql, safeValues)
    .then(results => {
      if (results.rowCount > 0) {
        for (let i = 0; i < results.rows.length; i++) {
          let book = results.rows[i]
          books.push(new Book(book.title, book.author, book.description, book.isbn, book.bookshelf, book.image_url));
        }
      }
      response.render('pages/index', { books: books, numBooks: books.length });
    })
    .catch((err) => { console.log(err); response.render('pages/error') });
}

function getForm(request, response) {
  response.render('pages/index');
}

function getBooks(request, response) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  let typeOfSearch = request.body.search[1];
  let searchCriteria = request.body.search[0];

  if (typeOfSearch === 'author') {
    url += `+inauthor:${searchCriteria}`;
  }

  if (typeOfSearch === 'title') {
    url += `+intitle:${searchCriteria}`;
  }

  superagent.get(url)
    .then(results => {
      let bookArray = results.body.items.map(book => {
        let bookInfo = book.volumeInfo
        if (bookInfo.imageLinks) {
          return new Book(bookInfo.title, bookInfo.authors, bookInfo.description, bookInfo.industryIdentifiers[0].identifier, 'all', bookInfo.imageLinks.smallThumbnail);
        } else {
          return new Book(bookInfo.title, bookInfo.authors, bookInfo.description, bookInfo.industryIdentifiers[0].identifier, 'all', 'https://images.pexels.com/photos/1005324/literature-book-open-pages-1005324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260');
        }

      });
      let returnArray = [];
      if (bookArray.length > 10) {
        returnArray = bookArray.slice(0, 10);
      } else {
        returnArray = bookArray;
      }
      response.render('pages/searches/show', { books: returnArray, bookshelves: bookshelfOptions });
    })
    .catch((err) => { console.log(err); response.render('pages/error') });
}


function Book(title, authors, description, isbn, bookshelf, image_url) {
  const placeholderImage = 'https://images.pexels.com/photos/1005324/literature-book-open-pages-1005324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260';
  if (image_url) {
    if (image_url === '') {
      this.image_url = placeholderImage;
    }
    else if (image_url.slice(0, 5) !== 'https') {
      this.image_url = 'https' + image_url.slice(4, image_url.length);
    } else {
      this.image_url = image_url;
    }
  } else {
    this.image_url = placeholderImage;
  }

  if (authors === undefined) {
    this.authors = 'no author available';
  } else {
    this.authors = authors;
  }
  this.title = title || 'no title available';
  this.description = description || 'this book has no description';
  this.isbn = isbn || '000';
  this.bookshelf = bookshelf || "All"
}

client.connect(() => {
  app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });
});

