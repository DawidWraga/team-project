import { PrismaClient, Prisma } from '@prisma/client';
import query from 'controllers/query';
import { writeToDb } from 'controllers/writeToDb';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
	try {
		// console.log(req.body);
		// const id = uuidv4();
		// const post = {
		// 	...req.body,
		// 	id,
		// 	timesince: '0 days',
		// 	replies: '0',
		// 	solved: false,
		// };
		// const posts = await query('posts');
		// const newposts = [post, ...posts];

		// await writeToDb('posts', newposts);

		const post = {
			title: 'test',
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const prisma = new PrismaClient();
		await prisma.post.create({ data: post });

		console.log('test');
		res.status(200).send(id);
	} catch (e) {
		res.status(400).send(e);
	}
}
