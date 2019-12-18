DROP TABLE IF EXISTS books;
CREATE TABLE books (
  title VARCHAR(255),
  description TEXT,
  author VARCHAR(255),
  isbn VARCHAR(255) PRIMARY KEY,
  bookshelf VARCHAR(255),
  image_url VARCHAR(255)
);

INSERT INTO books ( title, description, author, isbn, bookshelf, image_url) 
VALUES('Book', 'a really good book', 'Laura', '11122', 'fiction', 'https://images.pexels.com/photos/1005324/literature-book-open-pages-1005324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260');

INSERT INTO books (title, description, author, isbn, bookshelf, image_url) 
VALUES('Book2', 'a really good book2', 'Kai', '11123', 'non-fiction', 'https://images.pexels.com/photos/1005324/literature-book-open-pages-1005324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260');
