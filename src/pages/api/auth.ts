import { prisma } from 'lib-server/prisma';

export default async function handler(req, res) {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: req.body.email,
      },
    });

    if (user.password !== req.body.password)
      return res.status(403).json({ cause: 'Invalid credentials' });

    delete user.password;
    return res.json(user);
  } catch (e) {
    console.error(e);
    res.status(403).send();
  }
}
