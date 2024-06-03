import Shopify from "shopify-api-node"

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

export const updateStockById = async(req,res) =>{
const {id} = req.params

try {
    const products = await shop.product.get(id)
    const {variants} = products

    await req.getConnection(async(error,conexion)=>{
        if (error) {
            console.error(error)
            return res.status.json({mesagge:"Error con la conexion a la base de datos"})
        }
        /* Se requiere revisar la query porque el producto id vendra de otra clave */
        await conexion.query('SELECT stock FROM stock WHERE producto_id=?',[variants[0].sku],(err,data)=>{
            if(err) {
                console.error("Error en la Query",err)
                return res.status(500).json({"mesagge": "Algo salio mal en la cosulta"})
            }
                // prducto existe
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
                        const updated= updateStock(variants[0].inventory_item_id,data[0].stock) 
                        console.log(updated)
                        
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

}