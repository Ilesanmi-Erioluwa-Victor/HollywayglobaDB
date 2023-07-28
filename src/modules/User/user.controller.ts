import express from 'express';
import { createUser, loginUser } from './services/user.auth.service';

const route = express.Router();
route.post('/signup', createUser);
route.post('/login', loginUser);
export default route;
