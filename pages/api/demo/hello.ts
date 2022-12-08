import { apiHandler } from 'lib-server/nc';

const handler = apiHandler();

handler.get(async (req, res) => {
  res.json({ msg: 'hello' });
});

handler.put(async (req, res) => {
  const body = req.body;
  res.json({ body });
});

// create route and send msg: hello
// inside same route, if the HTTP method is PUT then respond world

export default handler;
