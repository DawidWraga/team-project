import fs from 'fs/promises';
import path from 'path';

import { setTimeoutPromise } from 'utils/setTimeoutPromise';

export async function writeToDb(table, newJSON) {
	try {
		const jsonDirectory = path.join(process.cwd(), `db/${table}.json`);
		fs.writeFile(jsonDirectory, JSON.stringify(newJSON));
		await setTimeoutPromise(500);
		return true;
	} catch (e) {
		console.error(e);
		return false;
	}
}
