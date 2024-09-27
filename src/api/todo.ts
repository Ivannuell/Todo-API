import router from 'express'
import createDatabaseConnection from '../database/sqlite.db'
import { checkTodoRequest } from '../middlewares'

const route = router()

route.get('/', (req, res) => {
    createDatabaseConnection()
        .then(db => {
            return db.all(`SELECT * FROM todos`); // Fetch all todos
        })
        .then(todos => {
            res.status(200).json(todos); // Send todos as JSON response
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error retrieving todos'); // Send error response
        });
});

route.get('/:id', async (req, res) => {
    try {
        const db = await createDatabaseConnection();
        const todo = await db.get('SELECT * FROM todos WHERE id = ?', [req.body.id]);

        if (!todo) {
            res.status(404).send('Todo not found');
        } else {
            res.status(200).json(todo);
        }
    } catch (error) {
        console.log(error);
        res.send(error);   
    } 
})

route.post('/', checkTodoRequest, async (req, res) => {
    const {title, description, status} = req.body
    try {
        const db = await createDatabaseConnection();
        
        await db.run(`INSERT INTO todos (title, description, status) VALUES (?, ?, ?)`, [title, description, status]);
        res.send('Database added').status(200); // Send response after all operations
    } catch (err) {
        console.log(err);
        res.status(500).send('Error adding to database'); // Send error response
    }
})


export default route