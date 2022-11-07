import query from 'controllers/query';
import { writeToDb } from 'controllers/writeToDb';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
	try {
		const id = uuidv4();
		const topic = {
			...req.body,
			numPosts: '0',
			id,
		};

		const topics = await query('topics');
		const newtopics = [topic, ...topics];

		await writeToDb('topics', newtopics);
		res.status(200).send(id);
	} catch (e) {
		res.status(400).send(e);
	}
}
