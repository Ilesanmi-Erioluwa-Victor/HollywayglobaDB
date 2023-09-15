import express from 'express';

import { Auth } from '../../../middlewares/auth';

const { Token, VerifiedUser} = Auth;

const route = express.Router();



route.get('/top-10-cheap-products', TopTenProducts);

export default route;
