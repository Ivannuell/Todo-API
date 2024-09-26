import { open, Database } from 'sqlite'
import sqlite3 from 'sqlite3'

export default async function createDatabaseConnection(): Promise<Database> {
    const db = await open({
        filename: 'todoDatabase.db',
        driver: sqlite3.Database
    });
    return db;
}

