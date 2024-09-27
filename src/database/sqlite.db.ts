import { open, Database } from 'sqlite'
import sqlite3 from 'sqlite3'

export default async function createDatabaseConnection(): Promise<Database> {
    try {
        const db = await open({
            filename: './todoDatabase.db',
            driver: sqlite3.Database
        });

        await db.exec(`
            CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                status TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`
        );
        return db;
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        throw error; // Rethrow the error after logging
    }
}