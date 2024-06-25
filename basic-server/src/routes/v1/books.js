
const { bookSchema, querySchema } = require('../../schemas/v1/books');

const bookRoutes = async (app) => {
  app.get('/books', {
    schema: {
      querystring: querySchema,
      response: {
        200: {
          type: 'array',
          items: bookSchema
        }
      }
    },
    handler: async (request, reply) => {
      const { author, publicationYear, page = 1, limit = 10, sort = 'DESC' } = request.query;
      let query = 'SELECT * FROM books WHERE 1=1';
      const params = [];
      let paramIndex = 1;
      if (author) {
        query += ` AND author ILIKE $${paramIndex++}`;
        params.push(`%${author}%`);
      }
      if (publicationYear) {
        query += ` AND publicationYear = $${paramIndex++}`;
        params.push(publicationYear);
      }
      query += ` ORDER BY publicationYear ${sort}`;
      query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
      params.push(limit, (page - 1) * limit);

      const { rows } = await app.pg.query(query, params);
      console.log(rows)
      reply.send(rows);
    }
  });

  app.get('/books/:isbn', {
    schema: {
      response: {
        200: bookSchema
      }
    },
    handler: async (request, reply) => {
      const { isbn } = request.params;
      const { rows } = await app.pg.query('SELECT * FROM books WHERE isbn = $1', [isbn]);
      if (rows.length === 0) {
        reply.status(404).send({ message: 'Book not found' });
      } else {
        reply.send(rows[0]);
      }
    }
  });

  app.post('/books', {
    schema: {
      body: bookSchema,
      response: {
        201: bookSchema
      }
    },
    handler: async (request, reply) => {
      const { title, author, isbn, publicationYear } = request.body;
      const { rows } = await app.pg.query(
        'INSERT INTO books (title, author, isbn, publicationYear) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, author, isbn, publicationYear]
      );
      reply.status(201).send(rows[0]);
    }
  });

  app.put('/books/:isbn', {
    schema: {
      body: bookSchema,
      response: {
        200: bookSchema
      }
    },
    handler: async (request, reply) => {
      const { isbn } = request.params;
      const { title, author, publicationYear } = request.body;
      const { rows } = await app.pg.query(
        'UPDATE books SET title = $1, author = $2, publicationYear = $3 WHERE isbn = $4 RETURNING *',
        [title, author, publicationYear, isbn]
      );
      if (rows.length === 0) {
        reply.status(404).send({ message: 'Book not found' });
      } else {
        reply.send(rows[0]);
      }
    }
  });

  app.delete('/books/:isbn', {
    handler: async (request, reply) => {
      const { isbn } = request.params;
      const { rowCount } = await app.pg.query('DELETE FROM books WHERE isbn = $1', [isbn]);
      if (rowCount === 0) {
        reply.status(404).send({ message: 'Book not found' });
      } else {
        reply.status(204).send();
      }
    }
  });
};

module.exports = { bookRoutes };
