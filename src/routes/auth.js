/*
    Routes URL internal for the different consultations
*/
import { Router } from 'express';
import * as userController from '../controllers/userController'
import verifyToken from '../middlewares/verifytoken'
var router = Router();

router.get('/sales/:id', verifyToken, userController.getDataUser)//Deliver user information
router.post('/login/', userController.login)// Validates the user/password and delivers an authorization token

export default router;