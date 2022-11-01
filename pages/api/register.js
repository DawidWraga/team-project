import query from 'controllers/query';
import fs from 'fs/promises';
import { setTimeoutPromise } from 'utils/setTimeoutPromise';

export default async function handler(req, res) {
	async function validateUnique(array, key, value) {
		const existingIndex = array.findIndex((item) => {
			if (item[key] === value) return true;
			else false;
		});

		const isExisting = existingIndex !== -1;

		if (isExisting) {
			res.status(400).json({ type: key, message: 'existing ' + key });
			return false;
		}

		return true;
	}

	try {
		const validUsers = await query('users');

		const emailIsValid = await validateUnique(
			validUsers,
			'email',
			req.body.email
		);
		const fullNameIsValid = await validateUnique(
			validUsers,
			'fullName',
			req.body.fullName
		);

		if (emailIsValid && fullNameIsValid) {
			delete req.body.confirmPassword;

			const newUsers = JSON.stringify([
				...validUsers,
				{ ...req.body, role: 'emp' },
			]);

			await fs.writeFile('db/users.json', newUsers);
			await setTimeoutPromise(500);

			return res.status(200).send('User successfully created');
		}
	} catch (e) {
		console.error(e);
	}
}
