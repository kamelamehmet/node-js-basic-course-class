
const bookSchema = {
  type: 'object',
  required: ['title', 'author', 'isbn', 'publicationYear'],
  properties: {
    id: { type: 'integer' },
    title: { type: 'string' },
    author: { type: 'string' },
    isbn: { type: 'string', pattern: '^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$' },
    publicationYear: { type: 'integer', minimum: 1500, maximum: new Date().getFullYear() }
  }
};

const updateBookSchema = {
  type: 'object',
  required: ['title', 'author', 'publicationYear'],
  properties: {
    id: { type: 'integer' },
    title: { type: 'string' },
    author: { type: 'string' },
    publicationYear: { type: 'integer', minimum: 1500, maximum: new Date().getFullYear() }
  }
}

const querySchema = {
  type: 'object',
  properties: {
    author: { type: 'string' },
    publicationYear: { type: 'integer', minimum: 1500, maximum: new Date().getFullYear() },
    page: { type: 'integer', minimum: 0 },
    limit: { type: 'integer', minimum: 1 },
    sort: { type: 'string', enum: ['ASC', 'DESC'] }
  }
};

module.exports = { bookSchema, querySchema, updateBookSchema };
