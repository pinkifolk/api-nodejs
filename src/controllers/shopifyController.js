import Shopify from "shopify-api-node"
import fs from 'fs'
const shop= new Shopify({
    shopName:process.env.SHOPIFY_NAME,
    apiKey:process.env.SHOPIFY_API_KEY,
    password:process.env.SHOPIFY_PASSWORD
})


async function updateStock (inventoryId,available){
    try {
        const update = await shop.inventoryLevel.set({
            location_id:process.env.SHOPIFY_LOCATATION_ID,
            inventory_item_id:inventoryId,
            available:available
        })
        return update
    } catch (error) {
        console.error(error)
    }
}

async function getCountProducto(){
    try {
        const countProduct = await shop.product.count()
        return countProduct
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Error en consultar los datos a shopify"})
    }

}

export const updateStockById = async(req,res) =>{
const {id} = req.params

    try {
        const products = await shop.product.get(id)
        const {variants} = products

        await req.getConnection(async(error,conexion)=>{
            if (error) {
                console.error(error)
                return res.status(500).json({mesagge:"Error con la conexion a la base de datos"})
            }
            /* Se requiere revisar la query porque el producto id vendra de otra clave */
            await conexion.query('SELECT stock FROM stock WHERE producto_id=?',[variants[0].sku],(err,data)=>{
                if(err) {
                    console.error("Error en la Query",err)
                    return res.status(500).json({"mesagge": "Algo salio mal en la cosulta"})
                }
                    // prducto no existe
                    if(data.length === 0) return res.status(404).json({"mesagge":"El producto no existe"})
                    // validar si existe cambio    
                    if(variants[0].inventory_quantity == data[0].stock){
                        res.json({
                                "sku":variants[0].sku,
                                "idShopify":variants[0].product_id,
                                "stockShopify":variants[0].inventory_quantity,
                                "stockActual": data[0].stock    
                            })
                    }else{                
                    //update a shopify
                        try {
                            updateStock(variants[0].inventory_item_id,data[0].stock) 
                            
                        } catch (upadteError) {
                            console.error(upadteError)
                            res.status(500).json({mesagge:"Error al cambiar stock del producto"})
                        }  
                    }
            })
        })      

        } catch (error) {
            console.error('Shopify error',error)
            res.status(500).json({message:"Error al obtener los datos desde shopify"})
        }
}
export const updateAll = async(req,res) =>{
const allProducts = await shop.product.list({limit:getCountProducto()})
 
let countLineUpdate = 0
let countLineNoFound = 0
let detNoFound =[]
for(const { variants } of allProducts){
    // buscar en la base de datos
    const data =await new Promise((resolve, reject) => {
        req.getConnection((error, conexion) => {
            if (error) {
                reject(error)
            } else {
                conexion.query('SELECT stock FROM stock WHERE producto_id=?', [variants[0].sku], (err, data) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(data)
                    }
                })
            }
        })
    })
    if (data.length === 0) {
        countLineNoFound++
        detNoFound.push(`el codigo: ${variants[0].sku} no existe`)
               
        
    } else if (data[0].stock != variants[0]?.inventory_quantity) {
        // actualizar
        try {
            updateStock(variants[0].inventory_item_id, data[0].stock)     
            countLineUpdate++
        } catch (error) {
            console.error(error)
        } 
    }
}
if(countLineNoFound > 0){
    fs.writeFileSync('no_existen.txt',JSON.stringify(detNoFound), err => {
        if (err) return console.error(err)
    }); 
}else{
    detNoFound=[]
}

res.json({
    message:"Proceso masivo realizado",
    productosAct: countLineUpdate,
    productosNoAct: countLineNoFound,
    urlDetalleProd:"https://api.provaltec.cl/api/shopify/download",
    urlDetalleDev:"http://localhost:3000/api/shopify/download",
})

}