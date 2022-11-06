import query from 'controllers/query';
import { writeToDb } from 'controllers/writeToDb';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  try {
    console.log(req.body);
    const post = {
      ...req.body,
      id: uuidv4(),
    };
    const posts = await query('posts');
    const newposts = [post, ...posts];

    console.log(newposts);

    await writeToDb('posts', newposts);
  } catch (e) {
    res.status(400).send(e);
  }
}
