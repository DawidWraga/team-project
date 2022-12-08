import { apiValidate } from 'lib-server/apiValidate';
import { apiHandler } from 'lib-server/nc';
import { z } from 'zod';

const handler = apiHandler();

const schema = z.object({ date: z.string() });

handler.get(apiValidate(schema, 'query'), async (req, res) => {
  // find date from query
  const date = req.query.date;
  // send date

  res.json({ date });
});
export default handler;
