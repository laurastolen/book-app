/* eslint-disable camelcase */
'use strict';

const express = require('express');
const app = express();
require('ejs');

const superagent = require('superagent');
const PORT = process.env.PORT || 3001;
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded());

app.get('/', getForm);
app.post('/searches', getBooks);
app.get('*', (request, response) => {
  response.render('pages/error');
});

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
        return new Book(book.volumeInfo);
      });
      let returnArray = [];
      if (bookArray.length > 10) {
        returnArray = bookArray.slice(0, 10);
      } else {
        returnArray = bookArray;
      }
      response.render('pages/searches/show', { books: returnArray, });
    })
    .catch((err) => response.render('pages/error'));
}


function Book(bookObj) {
  // console.log(bookObj.imageLinks)
  const placeholderImage = 'https://images.pexels.com/photos/1005324/literature-book-open-pages-1005324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260';
  if (bookObj.imageLinks) {
    if (bookObj.imageLinks.thumbnail === '') {
      this.image_url = placeholderImage;
    }
    else if (bookObj.imageLinks.thumbnail.slice(0, 5) !== 'https') {
      this.image_url = 'https' + bookObj.imageLinks.thumbnail.slice(4, bookObj.imageLinks.thumbnail.length);
    } else {
      this.image_url = bookObj.imageLinks.thumbnail;
    }
  } else {
    this.image_url = placeholderImage;
  }

  this.author = bookObj.author || 'no author available';
  this.title = bookObj.title || 'no title available';
  this.description = bookObj.description || 'this book has no description';
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
