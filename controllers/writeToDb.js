import fs from 'fs/promises';
import path from 'path';

import { setTimeoutPromise } from 'utils/setTimeoutPromise';

export async function writeToDb(table, newJSON) {
	const dbDirectory = path.join(process.cwd(), `db/${table}.json`);

	fs.writeFile(dbDirectory, JSON.stringify(newJSON));
	await setTimeoutPromise(200);
	return true;
}
