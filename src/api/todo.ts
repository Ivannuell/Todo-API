import router from 'express'
// import todoType from '../types/todoType'

const route = router()

route.get('/', (req, res) => {
    const { id, title, description, status } = req.body

    res.send(`${id} - ${title} - ${description || 'None'} - ${status}`)
})

export default route