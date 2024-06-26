const authRoutes = async (fastify) => {

fastify.post('/signup', async (request, reply) => {
    const { username, password, role } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const { rowCount } = await fastify.pg.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
      [username, hashedPassword, role]
    );
  
    if (rowCount === 1) {
      reply.code(201).send({ message: 'User created successfully' });
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
    const match = await bcrypt.compare(password, user.password);
  
    if (!match) {
      return reply.code(401).send({ message: 'Invalid username or password' });
    }
  
    const token = fastify.jwt.sign({ id: user.id, role: user.role });
    reply.send({ token });
  });
}

module.exports = {
    authRoutes
}


// const fastify = require('fastify')({ logger: true });
// const fastifyJwt = require('@fastify/jwt');
// const bcrypt = require('bcrypt');
// const postgres = require('@fastify/postgres');
// const formbody = require('@fastify/formbody'); // Add this line

// require('dotenv').config();

// fastify.register(formbody); // Register the formbody plugin

// fastify.register(postgres, {
//   connectionString: process.env.CONNECTION_STRING
// });

// fastify.register(fastifyJwt, {
//   secret: process.env.JWT_SECRET
// });

// fastify.post('/signup', async (request, reply) => {
//   const { username, password, role } = request.body;
//   const hashedPassword = await bcrypt.hash(password, 10);

//   const { rowCount } = await fastify.pg.query(
//     'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
//     [username, hashedPassword, role]
//   );

//   if (rowCount === 1) {
//     reply.code(201).send({ message: 'User created successfully' });
//   } else {
//     reply.code(500).send({ message: 'User creation failed' });
//   }
// });

// fastify.post('/signin', async (request, reply) => {
//   const { username, password } = request.body;

//   const { rows } = await fastify.pg.query('SELECT * FROM users WHERE username = $1', [username]);
//   if (rows.length === 0) {
//     return reply.code(401).send({ message: 'Invalid username or password' });
//   }

//   const user = rows[0];
//   const match = await bcrypt.compare(password, user.password);

//   if (!match) {
//     return reply.code(401).send({ message: 'Invalid username or password' });
//   }

//   const token = fastify.jwt.sign({ id: user.id, role: user.role });
//   reply.send({ token });
// });

// fastify.listen({ port: 4000 }, (err, address) => {
//   if (err) {
//     fastify.log.error(err);
//     process.exit(1);
//   }
//   fastify.log.info(`Server listening on ${address}`);
// });
