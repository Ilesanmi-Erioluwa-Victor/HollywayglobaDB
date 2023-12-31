import express from 'express';

const route = express.Router();
import { getCategories } from '../service/category.service';

route.get('/', getCategories);

export default route;
