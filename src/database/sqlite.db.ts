import { open, Database } from 'sqlite'
import sqlite3 from 'sqlite3'

type todo = {
    title: string,
    description: string,
    status: string
}


async function createDatabaseConnection(): Promise<Database> {
    try {
        const db = await open({
            filename: 'todoDatabase.db',
            driver: sqlite3.Database
        });

        await db.exec(`
            CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
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

export async function addTodo(todoItem: todo) {
    const { title , description, status} = todoItem
    const db = await createDatabaseConnection();
    const todo = await db.run(`INSERT INTO todos (title, description, status) VALUES (?, ?, ?)`, [title, description, status]);
    db.close();
    return todo
}

export async function getAllTodo(){
    const db = await createDatabaseConnection();
    const todos = await db.all(`SELECT * FROM todos`)
    db.close();
    return todos
}

export async function getTodoById(id: string){
    const db = await createDatabaseConnection();
    const todo = await db.get('SELECT * FROM todos WHERE id = ?', [id])
    db.close();
    return todo;
}

export async function removeTodoById(id: string): Promise<boolean> {

    const db = await createDatabaseConnection();
    if(!await getTodoById(id)) return false
    db.run('DELETE FROM todos WHERE id = ?', [id])
    db.close();
    return true
}

export async function updateTodo({title, description, status}: todo, id: string) {
    const db = await createDatabaseConnection();
    await db.run(`UPDATE todos SET title = ?, description = ?, status = ? WHERE id = ?`, [title, description, status, id]);
    db.close()
}

export async function lookForChanges() {
    const db = await createDatabaseConnection();
    const changes = await db.get('SELECT changes() AS changes');
    db.close()
        if (changes.changes === 0) {
            return false
        } else {
            return true
        }
}