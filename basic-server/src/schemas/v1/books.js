
const bookSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    author: { type: 'string' },
    isbn: { type: 'string', pattern: '^[0-9]{10}$' },
    publicationyear: { type: 'integer', minimum: 1500, maximum: new Date().getFullYear() }
  }
};

const updateBookSchema = {
  type: 'object',
  required: ['title', 'author', 'publicationYear'],
  properties: {
    title: { type: 'string' },
    author: { type: 'string' },
    publicationYear: { type: 'integer', minimum: 1500, maximum: new Date().getFullYear() }
  }
}

const querySchema = {
  type: 'object',
  properties: {
    author: { type: 'string' },
    publicationyear: { type: 'integer', minimum: 1500, maximum: new Date().getFullYear() },
    page: { type: 'integer', minimum: 0 },
    limit: { type: 'integer', minimum: 1 },
    sort: { type: 'string', enum: ['ASC', 'DESC'] }
  }
};

module.exports = { bookSchema, querySchema, updateBookSchema };
