import query from 'controllers/query';
import { setTimeoutPromise } from 'utils/setTimeoutPromise';
import nodemailer from 'nodemailer';
require('dotenv').config();

export default async function handler(req, res) {
	try {
		// return res.status(200).send('test');

		const validUsers = await query('users');
		const userDetails = validUsers.find(
			(user) => user.email === req.body?.email
		);

		if (userDetails) {
			return res.status(400).send('user already exists');
		}

		return res.status(200).send('user submitted');

		const transporter = nodemailer.createTransport({
			service: 'Hotmail',
			auth: {
				user: 'dadwid@hotmail.com',
				pass: process.env.PASSWORD,
			},
		});

		const mailData = {
			from: 'noreply@make-it-all.co.uk',
			to: 'D.Wraga-21@student.lboro.ac.uk',
			subject: `Invitation to join Make-It-All Portal!`,
			text: 'test',
			html: (
				<div>
					Dear Make-it-all employee,
					<br />
					<br />
					You have been invited to join the company online portal.
					<br />
					Please click this link to sign up:
					<a href="makeitall.vercel.app/register">Register Now</a>
					<br />
					<br />
					Kind regards,
					<br />
					Make-it-all invite bot
				</div>
			),
		};
		await transporter.sendMail(mailData, (err, info) => {
			if (err) console.log(err);
			else {
				console.log(info);
				res.status(200).send('Invite Has been set');
			}
		});
		res.status(200).send('Invite Has been set');
	} catch (e) {
		console.error(e);
	}
}
