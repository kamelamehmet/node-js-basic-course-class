
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
      let query = 'SELECT * FROM books';
      const params = [];
      let paramIndex = 1;
      if (author) {
        query += ` AND author ILIKE $${paramIndex++}`;
        params.push(`%${author}%`);
      }
      if (publicationYear) {
        query += ` AND publicationYear = ${paramIndex++}`;
        params.push(publicationYear);
      }
      query += ` ORDER BY publicationYear ${sort}`;
      query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
      params.push(limit, (page - 1) * limit);

      const { rows } = await app.pg.query(query, params);
      reply.send(rows);
    }
  });

  app.get('/books/:id', {
    schema: {
      response: {
        200: bookSchema
      }
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const { rows } = await app.pg.query('SELECT * FROM books WHERE id = $1', [id]);
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

  app.put('/books/:id', {
    schema: {
      body: bookSchema,
      response: {
        200: bookSchema
      }
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const { title, author, isbn, publicationYear } = request.body;
      const { rows } = await app.pg.query(
        'UPDATE books SET title = $1, author = $2, isbn = $3, publicationYear = $4 WHERE id = $5 RETURNING *',
        [title, author, isbn, publicationYear, id]
      );
      if (rows.length === 0) {
        reply.status(404).send({ message: 'Book not found' });
      } else {
        reply.send(rows[0]);
      }
    }
  });

  app.delete('/books/:id', {
    handler: async (request, reply) => {
      const { id } = request.params;
      const { rowCount } = await app.pg.query('DELETE FROM books WHERE id = $1', [id]);
      if (rowCount === 0) {
        reply.status(404).send({ message: 'Book not found' });
      } else {
        reply.status(204).send();
      }
    }
  });
};

module.exports = { bookRoutes };