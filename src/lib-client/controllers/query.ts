import path from 'path';
import fs from 'fs/promises';

export default async function query(table: string) {
  try {
    const dbDirectory = path.join(process.cwd(), 'src/db');
    const jsonData = await fs.readFile(dbDirectory + `/${table}.json`, 'utf8');
    const objectData = JSON.parse(jsonData);

    return objectData;
  } catch (e) {
    console.error(e);
    return false;
  }
}
