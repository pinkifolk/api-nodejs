import { Router } from "express"
import path from 'path'
import * as shopifyController from '../controllers/shopifyController'


var route = Router()
route.get('/download',(req,res)=>{
    const file = path.resolve(__dirname,'../../','no_existen.txt')
    res.download(file,(err)=>{
        if (err) return res.status(500).json({message:"Archivo no encontrado"})
    })
})
route.get('/all',shopifyController.updateAll)
route.get('/:id',shopifyController.updateStockById)
export default route