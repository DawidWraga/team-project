import fs from 'fs/promises';
import path from 'path';

import { setTimeoutPromise } from 'utils/setTimeoutPromise';

export async function writeToDb(table, newJSON) {
	try {
		const dbDirectory = path.join(process.cwd(), 'db');

		fs.writeFile(dbDirectory + `${table}.json`, JSON.stringify(newJSON));
		await setTimeoutPromise(500);
		return true;
	} catch (e) {
		console.error(e);
		return false;
	}
}
