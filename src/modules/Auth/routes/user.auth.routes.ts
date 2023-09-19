import { Router } from 'express';

const route = Router();

route.post('/register', validateRegisterInput, register);
route.post('/login', validateLoginInput, login);
route.get('/logout', logout);
export default route;
