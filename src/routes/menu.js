/*
    Routes URL internal for the different consultations
*/
import { Router } from 'express';
import * as menuController from '../controllers/menucontroller'
var router = Router();

router.get('/home/', menuController.getMenuHome)// Delivers the shortcut menu (green tabs)
router.get('/rrss/', menuController.getRRSS)// Provide the social media link

export default router;