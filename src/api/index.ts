import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import emojis from './emojis';
import todo from './todo'

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/todo', todo);
router.use('/emojis', emojis);

export default router;
