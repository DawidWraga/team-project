import query from 'controllers/query';
import { writeToDb } from 'controllers/writeToDb';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  try {
    console.log(req.body);
    const topic = {
      ...req.body,
      numPosts: '0',
      id: uuidv4(),
    };
    const topics = await query('topics');
    const newtopics = [topic, ...topics];

    console.log(newtopics);

    await writeToDb('topics', newtopics);
  } catch (e) {
    res.status(400).send(e);
  }
}
