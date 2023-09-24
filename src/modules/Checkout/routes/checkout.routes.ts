import { Router } from 'express';
import { Checkout } from '../services/checkout.service';

const route = Router();

 route.post('', Checkout);

export default route;
