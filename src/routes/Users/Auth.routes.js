import express from 'express';
import * as userCtrl from '../../controller/Auth.controller.js';
import {constants as VALIDATION} from '../../constant/validation.js';
import {uservalidation} from '../../validation/users.validation.js';
import * as MiidlewareUser from '../../middleware/Auth';
const routes = express.Router();

const PATH ={
    SINGUP:'/singup',
    LOGIN:'/login'
}

routes.post(PATH.SINGUP, uservalidation(VALIDATION.SINGUP) ,MiidlewareUser.EmailMiddle ,userCtrl.usercreate)

routes.post(PATH.LOGIN, uservalidation(VALIDATION.LOGIN_USER), userCtrl.loginpage);
  

export default routes;