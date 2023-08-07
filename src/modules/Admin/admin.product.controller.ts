import express from 'express';
import { AuthMiddleWare, adminRole } from '../../middlewares/auth/authToken';

const route = express.Router();
