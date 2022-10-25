import path from 'path';
import fsPromises from 'fs/promises';
import { setTimeoutPromise } from 'utils/setTimeoutPromise';

export default async function query(table: string) {
	const jsonDirectory = path.join(process.cwd(), `db/${table}.json`);
	const jsonData = await fsPromises.readFile(jsonDirectory, 'utf8');
	const objectData = JSON.parse(jsonData);

	// simulate response delay
	await setTimeoutPromise(500);

	return objectData;
}
