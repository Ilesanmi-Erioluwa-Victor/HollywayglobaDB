import { Router } from 'express';
import { createOrder } from '../services/order.service';

const route = Router();

route.post('/place-order', createOrder);
export default route;
