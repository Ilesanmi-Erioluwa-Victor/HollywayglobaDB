import express from 'express';

// import { Auth } from '../../../middlewares/auth';

// const { Token, VerifiedUser } = Auth;

import { TopTenProducts, Products, Product } from '../services/product.service';

const route = express.Router();

route.get('/', Products);

route.get('/:id', Product);


route.get('/top-10-cheap-products', TopTenProducts);

export default route;
