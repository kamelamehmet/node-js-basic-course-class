const bcrypt = require("bcrypt")
const authRoutes = async (fastify) => {

  fastify.post('/signup', async (request, reply) => {
    const { username, password, role } = request.body;
    console.log(request.body)

    const hashedPassword = await bcrypt.hash(password, 10)
    const { rowCount } = await fastify.pg.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
      [username, hashedPassword, role]
    );

    if (rowCount === 1) {
      reply.code(201).send({ message: 'User created successfully', token: fastify.jwt.sign({ username, role }) });
    } else {
      reply.code(500).send({ message: 'User creation failed' });
    }


  });

  fastify.post('/signin', async (request, reply) => {
    const { username, password } = request.body;
    const { rows } = await fastify.pg.query('SELECT * FROM users WHERE username = $1', [username]);
    if (rows.length === 0) {
      return reply.code(401).send({ message: 'Invalid username or password' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password)
    console.log(user)
    if (!match) {
      reply.code(401).send({ message: 'Invalid username or password' });
    }

    const token = fastify.jwt.sign({ id: user.id, role: user.role });
    reply.send({ token });


  });
}

module.exports = {
  authRoutes
}
