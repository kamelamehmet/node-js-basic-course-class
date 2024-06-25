const { books } = require('../../models/book');
const { bookSchema, querySchema, updateBookSchema } = require('../../schemas/v1/books');


function bookRoutes(fastify, options, done) {
  fastify.get('/books', {
    schema: {
      querystring: querySchema,
      response: {
        200: {
          type: 'array',
          items: bookSchema
        }
      }
    }
  }, getBooks);

  fastify.get('/books/:isbn', {
    schema: {
      response: {
        200: bookSchema,
        404: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, getBookById);

  fastify.post('/books', {
    schema: {
      body: bookSchema,
      response: {
        201: bookSchema,
        409: {
          type: "object",
          properties: {
            message: {
              type: "string"
            }
          }
        }
      }
    }
  }, addBook);

  fastify.put('/books/:isbn', {
    schema: {
      body: updateBookSchema,
      response: {
        200: bookSchema,
        404: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, updateBook);

  fastify.delete('/books/:isbn', {
    schema: {
      response: {
        204: {
          type: 'null'
        },
        404: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, deleteBook);

  done();
}

function getBooks(request, reply) {
  let { author, publicationYear, page = 0, limit = 10, sort = 'DESC' } = request.query;

  let filteredBooks = books.slice(); 

  if (author) {
    filteredBooks = filteredBooks.filter(book => book.author.toLowerCase().includes(author.toLowerCase()));
  }

  if (publicationYear) {
    filteredBooks = filteredBooks.filter(book => book.publicationYear === parseInt(publicationYear));
  }

  filteredBooks.sort((a, b) => sort === 'ASC' ? a.publicationYear - b.publicationYear : b.publicationYear - a.publicationYear);

  page = Math.max(1, parseInt(page)); 
  limit = Math.max(1, parseInt(limit)); 
  const start = (page) * limit;
  const paginatedBooks = filteredBooks.slice(start, start + limit);

  reply.send(paginatedBooks);
}

function getBookById(request, reply) {
  const book = books.find(b => b.isbn === request.params.isbn);
  if (book) {
    reply.send(book);
  } else {
    reply.status(404).send({ message: 'Book not found' });
  }
}

function addBook(request, reply) {
  if (books.findIndex(b => b.isbn === request.body.isbn) !== -1) return reply.status(409).send({ message: "Book with that isbn already exists" })
  books.push(request.body);
  reply.status(201).send("Book added succesfully");
}

function updateBook(request, reply) {
  const index = books.findIndex(b => b.id === request.params.id);
  if (index !== -1) {
    books[index] = { ...books[index], ...request.body };
    reply.send(books[index]);
  } else {
    books.push(request.body)
  }
}

function deleteBook(request, reply) {
  const index = books.findIndex(b => b.isbn === request.params.isbn);
  if (index !== -1) {
    books.splice(index, 1);
    reply.status(204).send();
  } else {
    reply.status(404).send({ message: 'Book not found' });
  }
}
module.exports = { bookRoutes };
