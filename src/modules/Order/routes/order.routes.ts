import { Router } from 'express';
import { cancelOrder, createOrder, getOrders } from '../services/order.service';

const route = Router();

route.post('/place-order', createOrder);

route.get('', getOrders);

route.get('/:orderId');

route.put('/:orderId', cancelOrder);
export default route;
