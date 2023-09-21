import express from 'express';

const route = express.Router();

route.post(
  '/:id/category'
  // Token, Admin,
  // createCategory
);

route.get(
  '/:id/category/:categoryId'
  // Token, Admin,
  // findCategory
);

route.put(
  '/:id/category/:categoryId'
  // Token, Admin,
  // editCategory
);

route.get(
  '/categories'
  // Token,
  // getCategories
);

route.delete(
  '/:id/category/:categoryId'
  // Token, Admin,
  // deleteCategory
);

export default route;
