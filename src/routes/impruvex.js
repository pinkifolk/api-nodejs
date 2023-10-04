import { Router } from "express";
import * as impruvexController from '../controllers/impruvexController'
// import verifyToken from '../middlewares/verifytoken'
var router = Router();

router.post('/asn/', impruvexController.verificarAsn)
router.post('/despachoExpress/', impruvexController.despachoExpress)
export default router;