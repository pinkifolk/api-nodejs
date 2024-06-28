import Shopify from "shopify-api-node"
import fs from "fs"
const shop = new Shopify({
  shopName: process.env.SHOPIFY_NAME,
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_PASSWORD,
})

async function updateStock(inventoryId, available) {
  try {
    const update = await shop.inventoryLevel.set({
      location_id: process.env.SHOPIFY_LOCATATION_ID,
      inventory_item_id: inventoryId,
      available: available,
    })
    return update
  } catch (error) {
    console.error(error)
  }
}

async function getCountProducto() {
  try {
    const countProduct = await shop.product.count()
    return countProduct
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: "Error en consultar los datos a shopify" })
  }
}
export const updateAll = async (req, res) => {
  try {
    const allProducts = await shop.product.list({ limit: 2 })
    const totalProd = allProducts.length
    var countLineUpdate = 0
    var countLineNoFound = 0
    var detNoFound = []

    for (const { variants } of allProducts) {
      // buscar en la base de datos
      for (const variant of variants) {
        const data = await new Promise((resolve, reject) => {
          req.getConnection((error, conexion) => {
            if (error) {
              reject(error)
            } else {
              conexion.query(
                'SELECT stock FROM stock WHERE producto_id=(SELECT id FROM productos WHERE origen="P" AND cod_unificado=?)',
                [variant.sku],
                (err, data) => {
                  if (err) {
                    reject(err)
                  } else {
                    resolve(data)
                  }
                }
              )
            }
          })
        })
        if (data.length === 0) {
          countLineNoFound += 1
          detNoFound.push(`el codigo: ${variant.sku} no existe`)
        } else if (data[0].stock != variant.inventory_quantity) {
          // actualizar
          try {
            updateStock(variant.inventory_item_id, data[0].stock)
            countLineUpdate += 1
          } catch (error) {
            console.error(error)
          }
        }
      }
    }
    if (countLineNoFound > 0) {
      fs.writeFileSync("no_existen.txt", JSON.stringify(detNoFound), (err) => {
        if (err) return console.error(err)
      })
    } else {
      detNoFound = []
    }

    res.json({
      message: "Proceso masivo realizado",
      totalProd:totalProd,
      prodActualizados: countLineUpdate,
      prodNoEncontrados: countLineNoFound,
      ...(countLineNoFound > 0) && {urlDetalleNoEncontrados: "https://api.provaltec.cl/api/shopify/download"},
      ...(countLineNoFound > 0) && {urlDetalleNoEncontradosDev: "http://localhost:3000/api/shopify/download"} 
      
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error al realizar el proceso" })
  }
}

