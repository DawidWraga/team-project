import query from 'controllers/query';

export default async function handler(req, res) {
	try {
		const validUsers = (await query('users')).users;

		const userDetails = validUsers.find((user) => {
			if (user.email !== req.body.email) return false;
			if (user.password !== req.body.password) return false;
			return true;
		});

		if (userDetails)
			return res.status(200).json({
				email: userDetails.email,
				role: userDetails.role,
			});
		else {
			return res.status(403).json({ msg: 'user not found' });
		}
	} catch (e) {
		console.error(e);
	}
}
