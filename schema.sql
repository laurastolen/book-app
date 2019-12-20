DROP TABLE IF EXISTS books;
CREATE TABLE books (
  title VARCHAR(255),
  description TEXT,
  author VARCHAR(255),
  isbn VARCHAR(255) PRIMARY KEY,
  bookshelf VARCHAR(255),
  image_url VARCHAR(255)
);

INSERT INTO books (bookshelf, isbn) 
VALUES('fiction', 'dummy data - fiction');

INSERT INTO books (bookshelf, isbn) 
VALUES('non-fiction', 'dummy data - non-fiction');

INSERT INTO books (bookshelf, isbn) 
VALUES('sci-fi', 'dummy data - sci-fi');

INSERT INTO books (bookshelf, isbn) 
VALUES('romance', 'dummy data - romance');

INSERT INTO books (bookshelf, isbn) 
VALUES('young adult', 'dummy data - young adult');

INSERT INTO books (bookshelf, isbn) 
VALUES('history', 'dummy data - history');