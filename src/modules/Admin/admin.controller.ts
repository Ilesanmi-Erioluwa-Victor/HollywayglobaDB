import express from 'express';
import {
  AuthMiddleWare,
  adminRole,
} from '../../middlewares/auth/authToken';
import { adminSignup } from './services/admin.auth.service';

const route = express.Router();
route.post("adminsignup", adminSignup)
