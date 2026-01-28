import jsonServer from 'json-server';
import cors from 'cors';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(cors());
server.use(middlewares);

// Use default router
server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});
