import { Router } from "express"
import * as syncController from '../controllers/syncController'

var route = Router()


route.get('/sync', syncController.insertDataToFile)

export default route