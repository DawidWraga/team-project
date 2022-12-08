import { apiValidate } from 'lib-server/apiValidate';
import { apiHandler } from 'lib-server/nc';
import { z } from 'zod';

const handler = apiHandler();

const schema = z.object({
  method: z.enum(['multi', 'add']),
  data: z.object({
    a: z.number(),
    b: z.number(),
  }),
});

handler.get(apiValidate(schema), async (req, res) => {
  const { method, data } = req.body;

  if (method === 'add') {
    res.json({ result: data.a + data.b });
  } else if (method === 'multi') {
    res.json({ result: data.a * data.b });
  }

  // else {
  //   res.status(400).json({ error: 'method of found. Please use "multi" or "add"' });
  // }
});
export default handler;
