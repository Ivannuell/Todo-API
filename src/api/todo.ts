import router from 'express'
import { todo } from '../types/todoType'

const route = router()

route.get('/', (req, res) => {
    const { id, title, description, status }: todo = req.body


})

export default route