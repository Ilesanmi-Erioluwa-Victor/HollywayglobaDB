import { Router } from 'express';
import {
  cancelOrder,
  createOrder,
  getOrder,
  getOrders,
} from '../services/order.service';

const route = Router();

route.post('/place-order', createOrder);

route.get('', getOrders);

route.get('/:orderId', getOrder);

route.put('/cancel/:orderId', cancelOrder);
export default route;
