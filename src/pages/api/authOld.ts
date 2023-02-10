import { prisma } from 'lib-server/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: req.body.email,
      },
    });

    if (user.password !== req.body.password)
      return res.status(403).json({ cause: 'Invalid credentials' });

    // @ts-ignore.
    delete user.password;
    return res.json(user);
  } catch (e) {
    console.error(e);
    res.status(403).send(e);
  }
}
