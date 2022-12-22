import query from 'controllers/query';
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
      return res.status(403).json({ msg: 'user not found' });
    }
  } catch (e) {
    console.error(e);
  }
}