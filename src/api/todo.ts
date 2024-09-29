import router from 'express'
import { addTodo, getAllTodo, getTodoById, lookForChanges, removeTodoById, updateTodo } from '../database/sqlite.db'

const route = router()

route.get('/', async (req, res) => {
  try {
    const todos = await getAllTodo();
    res.status(200).json(todos);
  }
  catch (err) {
    console.log(err);
    res.status(500).send('Error retrieving todos'); // Send error response
  };
});

route.get('/:id', async (req, res) => {
  try {
    const todo = await getTodoById(req.params.id)
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

route.post('/', async (req, res) => {
  const { title, description, status } = req.body

  if (!title) {
    res.send('Title is required').status(400);
  }

  try {
    await addTodo({ title, description, status })
    res.send('Database added').status(200); // Send response after all operations
  } catch (err) {
    console.log(err);
    res.status(500).send('Error adding to database'); // Send error response
  }
})

route.delete('/:id', async (req, res) => {
  try {
    if (await removeTodoById(req.params.id)) {
      res.send('todo in Database deleted').status(200);
    } else {
      return res.status(404).send(`Todo does not exist`);
    }
    const changes = await lookForChanges()
    if (!changes) {
      res.status(404).send(`No change in database`);
    }
  } catch (error) {
    res.send(error).status(404)
  }
})

route.put('/:id', async (req, res) => {
  try {
    let { title, description, status } = req.body

    const todo = await getTodoById(req.params.id)
    if (!todo) {
      return res.status(404).send('Todo not found');
    }
    const { t_title, t_description, t_status } = todo

    title = t_title ?? title;
    description = t_description ?? description;
    status = t_status ?? status;
    
    updateTodo({ title, description, status }, req.params.id)

    res.status(200).send('Database updated');
  } catch (error) {
    res.status(400).send(error);
  }
})

export default route 