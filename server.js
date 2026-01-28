import jsonServer from 'json-server';
import cors from 'cors';
import fs from 'fs';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(cors());
server.use(middlewares);

// Middleware to auto-save changes to db.json
router.render = (req, res) => {
  // After each request, save the database
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const db = router.db.getState();
    fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
  }
  res.jsonp(res.locals.data);
};

// Use default router
server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});
