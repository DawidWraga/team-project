import query from 'controllers/query';
import { writeToDb } from 'controllers/writeToDb';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
	try {
		const comment = {
			...req.body,
			solution: false,
			id: uuidv4(),
			postdate: '0',
		};
		const comments = await query('postComments');
		const newcomments = [comment, ...comments];
		await writeToDb('postComments', newcomments);
		res.status(200).send('reply posted');
	} catch (e) {
		res.status(400).send(e);
	}
}
