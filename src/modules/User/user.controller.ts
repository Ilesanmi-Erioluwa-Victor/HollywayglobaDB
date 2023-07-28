import express from 'express';
import { createUser } from './services/user.auth.service';

const route = express.Router();
route.post('/signup', createUser);

export default route;
