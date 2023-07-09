import { AuthMiddleWare } from './../../middlewares/authToken';
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
  generate_verification,
  account_verification,
  forget_password_token,
} from '../../model/user/user.controller';

const userRouter = express.Router();

userRouter.post('/signup', create_user);
userRouter.post('/login', login_user);
// Password rest
userRouter.post('/forget_password_token', forget_password_token);
userRouter.put('/reset_password', reset_password);

userRouter.post('/sendmail', AuthMiddleWare, generate_verification);
userRouter.put('/verify_account',AuthMiddleWare, account_verification);
userRouter.get('/',AuthMiddleWare, get_users);
userRouter.get('/:id', get_user);
userRouter.delete('/:id', delete_user);
userRouter.put('/password', update_password);
userRouter.put('/update-profile/:id', update_user);

export default userRouter;
