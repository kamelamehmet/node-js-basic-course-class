const bcrypt = require("bcrypt")
const authRoutes = async (fastify) => {

  fastify.post('/signup', async (request, reply) => {
    const { username, password, role } = request.body;

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) reply.send(err)
      const { rowCount } = await fastify.pg.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
        [username, hash, role]
      );

      if (rowCount === 1) {
        reply.code(201).send({ message: 'User created successfully' });
      } else {
        reply.code(500).send({ message: 'User creation failed' });
      }
    });

  });

  fastify.post('/signin', async (request, reply) => {
    const { username, password } = request.body;


    const { rows } = await fastify.pg.query('SELECT * FROM users WHERE username = $1', [username]);
    if (rows.length === 0) {
      return reply.code(401).send({ message: 'Invalid username or password' });
    }

    const user = rows[0];
    console.log(user)
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) reply.send(err)
      if (!match) {
        reply.code(401).send({ message: 'Invalid username or password' });
      }

      const token = fastify.jwt.sign({ id: user.id, role: user.role });
      reply.send({ token });

    });

  });
}

module.exports = {
  authRoutes
}
