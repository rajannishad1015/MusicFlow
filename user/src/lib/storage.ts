import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'MusicFlowTools';
const STORE_NAME = 'file-cache';
const VERSION = 1;

export async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveFile(id: string, file: File | Blob): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, file, id);
}

export async function getFile(id: string): Promise<File | Blob | undefined> {
  const db = await getDB();
  return db.get(STORE_NAME, id);
}

export async function deleteFile(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function clearCache(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
}
