import { Router } from "express"
import * as shopifyController from '../controllers/shopifyController'


var route = Router()
route.get('/:id',shopifyController.updateStockById)
route.get('/all',shopifyController.updateAll)
export default route