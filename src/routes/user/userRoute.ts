import { AuthMiddleWare, isUserVerified } from './../../middlewares/authToken';
import express from 'express';
import {
  create_user,
  login_user,
  reset_password,
  get_users,
  get_user,
  delete_user,
  update_user,
  update_password,
  // generate_verification,
  account_verification,
  forget_password_token,
} from '../../model/user/user.controller';

const userRouter = express.Router();

userRouter.post('/signup', create_user);
userRouter.post('/login', login_user);
// Password rest
userRouter.post('/forget_password_token', forget_password_token);
userRouter.put('/reset_password', reset_password);

// userRouter.post('/sendmail/:id', AuthMiddleWare, generate_verification);
userRouter.put('/verify_account/:token', account_verification);
userRouter.get('/', AuthMiddleWare,isUserVerified, get_users);
userRouter.get('/:id', AuthMiddleWare, get_user);
userRouter.delete('/:id', AuthMiddleWare, delete_user);
userRouter.put('/password/:id', AuthMiddleWare, update_password);
userRouter.put('/update-profile/:id', AuthMiddleWare, update_user);

export default userRouter;
