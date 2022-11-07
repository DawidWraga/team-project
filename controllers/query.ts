import path from 'path';
import fs from 'fs/promises';

export default async function query(table: string) {
	try {
		const jsonDirectory = path.join(process.cwd(), `db/${table}.json`);
		const jsonData = await fs.readFile(jsonDirectory, 'utf8');
		const objectData = JSON.parse(jsonData);

		return objectData;
	} catch (e) {
		console.error(e);
		return false;
	}
}
