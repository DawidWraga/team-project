import path from 'path';
import fs from 'fs/promises';
import { setTimeoutPromise } from 'utils/setTimeoutPromise';

export default async function query(table: string) {
	const jsonDirectory = path.join(process.cwd(), `db/${table}.json`);
	const jsonData = await fs.readFile(jsonDirectory, 'utf8');
	const objectData = JSON.parse(jsonData);

	// simulate response delay
	await setTimeoutPromise(500);

	return objectData;
}
