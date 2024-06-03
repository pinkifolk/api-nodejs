/*
    Import Module
*/
import express from 'express'
import cors from 'cors'
import pkg from '../package.json'
import myconn from 'express-myconnection'
import products from './routes/products'
import menu from './routes/menu'
import user from './routes/auth'
import impruvex from './routes/impruvex'
import conexion from './database'
import mysql from 'mysql'
import verifytoken from './middlewares/verifytoken'
import shopify from './routes/shopify'
/*
    Init and configuration of the module
*/
const app = express()
app.set('pkg', pkg)
app.use(cors(corsOptions))
app.use(myconn(mysql, conexion, 'single'))
app.use(express.json())

/*
    configuration the Cors
 */
var corsOptions = {
    origin: '*', // can specify one domain or allow all whith * 
    optionsSuccessStatus: 200
}

/*
    Rutes URL to get the information
*/
//Information about the application
app.get('/', (req, res) => {
    res.json({
        name: app.get('pkg').name,
        author: app.get('pkg').author,
        description: app.get('pkg').description,
        version: app.get('pkg').version
    })
})
// Information about the products
app.use('/api/products', verifytoken, products)
// Information about the menu and rrss
app.use('/api/menu', menu)
// Information about the user
app.use('/api/user', user)
// Integration with Impruvex
app.use('/api/impruvex', impruvex)
// Integration with Shopify
app.use('/api/shopify', shopify)



export default app;