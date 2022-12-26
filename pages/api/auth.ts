import query from 'lib-client/controllers/query';
import { setTimeoutPromise } from 'utils/setTimeoutPromise';

export default async function handler(req, res) {
  try {
    const validUsers = await query('users');

    await setTimeoutPromise(1500);

    const userDetails = validUsers.find((user) => {
      if (user.email !== req.body.email) return false;
      if (user.password !== req.body.password) return false;
      return true;
    });

    if (userDetails) {
      delete userDetails.password;
      return res.status(200).json(userDetails);
    } else {
      return res.status(403).json({ cause: 'Invalid credentials' });
    }
  } catch (e) {
    console.error(e);
    res.status(403).send();
  }
}
