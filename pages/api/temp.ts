import { apiValidate } from 'lib-server/apiValidate';
import { apiHandler } from 'lib-server/nc';

const handler = apiHandler();

handler.get(async (req, res) => {
  res.send({ data: [1, 2, 3], msg: 'HI!' });
});

handler.post(async (req, res) => {
  res.json({ 'RECEIVED DATA': req.body });
});

export default handler;
