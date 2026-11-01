import express from 'express';
import {
  getInventory,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
  consumeItem,
  seedDummyData,
  getStatus,
} from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/status', getStatus);
router.post('/seed', seedDummyData);

router.get('/', getInventory);
router.post('/', addItem);
router.get('/:id', getItemById);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);
router.post('/:id/consume', consumeItem);

export default router;
