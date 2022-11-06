import query from 'controllers/query';
import { writeToDb } from 'controllers/writeToDb';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
	try {
		// const router = useRouter();
		// const { routeid } = router.query;
		// console.log(routeid)
		// console.log(req.body);
		// const comment = {
		//   ...req.body,
		//   id: routeid,
		//   timesince: '0 days',
		//   replies: '0',
		//   solved: false,
		// };
		// const comments = await query('postComments');
		// const newcomments = [comment, ...comments];

		// console.log(newcomments);

		// await writeToDb('postComments', newcomments);
		res.status(200).send('');
	} catch (e) {
		res.status(400).send(e);
	}
}
