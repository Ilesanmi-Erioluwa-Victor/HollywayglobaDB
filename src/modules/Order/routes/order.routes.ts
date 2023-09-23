import { Router } from 'express';
import { cancelOrder, createOrder } from '../services/order.service';

const route = Router();

route.post('/place-order', createOrder);

route.put('/:orderId', cancelOrder);
export default route;
