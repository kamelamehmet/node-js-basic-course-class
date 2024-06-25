
const { books } = require('./data');
const { bookSchema, querySchema } = require('./schema');


const routes = [
  {
    method: 'GET',
    url: '/books',
    schema: {
      querystring: querySchema,
      response: {
        200: {
          type: 'array',
          items: bookSchema
        }
      }
    },
    handler: (request, reply) => {
      let { author, publicationYear, page = 1, limit = 10, sort = 'DESC' } = request.query;

      let filteredBooks = books;

      if (author) {
        filteredBooks = filteredBooks.filter(book => book.author.toLowerCase().includes(author.toLowerCase()));
      }

      if (publicationYear) {
        filteredBooks = filteredBooks.filter(book => book.publicationYear === parseInt(publicationYear));
      }

      if (sort === 'ASC') {
        filteredBooks.sort((a, b) => a.publicationYear - b.publicationYear);
      } else {
        filteredBooks.sort((a, b) => b.publicationYear - a.publicationYear);
      }

      const start = (page - 1) * limit;
      const end = page * limit;
      const paginatedBooks = filteredBooks.slice(start, end);

      reply.send(paginatedBooks);
    }
  },
  {
    method: 'GET',
    url: '/books/:id',
    schema: {
      response: {
        200: bookSchema
      }
    },
    handler: (request, reply) => {
      const book = books.find(b => b.id === parseInt(request.params.id));
      if (book) {
        reply.send(book);
      } else {
        reply.status(404).send({ message: 'Book not found' });
      }
    }
  },
  {
    method: 'POST',
    url: '/books',
    schema: {
      body: bookSchema,
      response: {
        201: bookSchema
      }
    },
    handler: (request, reply) => {
      const newBook = { id: books.length + 1, ...request.body };
      books.push(newBook);
      reply.status(201).send(newBook);
    }
  },
  {
    method: 'PUT',
    url: '/books/:id',
    schema: {
      body: bookSchema,
      response: {
        200: bookSchema
      }
    },
    handler: (request, reply) => {
      const index = books.findIndex(b => b.id === parseInt(request.params.id));
      if (index !== -1) {
        books[index] = { ...books[index], ...request.body };
        reply.send(books[index]);
      } else {
        reply.status(404).send({ message: 'Book not found' });
      }
    }
  },
  {
    method: 'DELETE',
    url: '/books/:id',
    handler: (request, reply) => {
      const index = books.findIndex(b => b.id === parseInt(request.params.id));
      if (index !== -1) {
        books.splice(index, 1);
        reply.status(204).send();
      } else {
        reply.status(404).send({ message: 'Book not found' });
      }
    }
  }
];

module.exports = routes;