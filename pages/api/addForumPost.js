import query from 'controllers/query';
import { writeToDb } from 'controllers/writeToDb';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentUser } from 'controllers/auth';

export default async function handler(req, res) {
  try {
    console.log(req.body);
    const id = uuidv4();
    const post = {
      ...req.body,
      id,
      timesince: '0 days',
      replies: '0',
      solved: false,
    };
    const posts = await query('posts');
    const newposts = [post, ...posts];


    await writeToDb('posts', newposts);
    res.status(200).send(id);
  } catch (e) {
    res.status(400).send(e);
  }
}
