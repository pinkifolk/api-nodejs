/*
    Routes URL internal for the different consultations
*/
import { Router } from 'express';
import * as productsController from '../controllers/productController'
var router = Router();

router.get('/:id', productsController.getProductsById)// Deliver product families
router.get('/special/:id', productsController.getProductsSpecialById) // Delivers the families of special products such as Bronze Valve and Fire Network
router.get('/variable/:id', productsController.getVariablesById)// Gives the characteristics of the family
router.get('/multimedia/:id', productsController.getFamiliaMultimediaById)// Deliver the image and the family file
router.get('/products/:id', productsController.getProductosById) // Deliver the list of products
router.get('/productoshome/:id', productsController.getProductosInicioById)//Deliver the families of the shortcuts of the unicio (green tabs)

export default router;