import { apiHandler } from 'lib-server/nc';
import prisma from 'lib-server/prisma';

const handler = apiHandler();

handler.get(async (req, res) => {
  const { where } = req.body;

  const examples = await prisma.example.findMany({ where });

  if (!examples.length) return res.status(400).json({ msg: 'non found' });

  res.json({ examples });
});

export default handler;
