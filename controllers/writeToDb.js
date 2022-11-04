import fs from 'fs/promises';
import { setTimeoutPromise } from 'utils/setTimeoutPromise';

export async function writeToDb(table, newJSON) {
  try {
    fs.writeFile(`db/${table}.json`, JSON.stringify(newJSON));
    await setTimeoutPromise(500);
    return true;
  } catch (e) {
    console.error(e);
  }
}
