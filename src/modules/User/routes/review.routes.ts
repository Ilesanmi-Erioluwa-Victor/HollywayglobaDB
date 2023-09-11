import express from 'express';

import { Auth } from '../../../middlewares/auth';

const { Token, VerifiedUser } = Auth;

const route = express.Router();

export default route;
