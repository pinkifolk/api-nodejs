import Shopify from "shopify-api-node"

const shop = new Shopify({
  shopName: process.env.SHOPIFY_NAME,
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_PASSWORD,
})

async function updateStock(data) {
  try {
    data.map(async (items) => {
      await shop.inventoryLevel.set({
        location_id: process.env.SHOPIFY_LOCATATION_ID,
        inventory_item_id: items.inventory_item_id,
        available: items.available,
      })
    })
  } catch (error) {
    console.error(error)
  }
}
async function getProducts() {
  let params = { limit: 250 }
  let variante = []
  let j = 1

  do {
    const product = await shop.product.list(params)
    product.forEach((prod, index) => {
      variante.push({
        index: j,
        title: prod.title,
        variants: prod.variants,
      })
    })
    j++

    params = product.nextPageParameters
  } while (params !== undefined)
  return variante
}
export const updateAll = async (req, res) => {
  //procesar datos de shopify
  const variants = await getProducts()
  let allVariants = []
  for (const { variants } of variants) {
    for (const variant of variants) {
      allVariants.push({
        sku: variant.sku,
        variantId: variant.inventory_item_id,
        stockShop: variant.inventory_quantity,
      })
    }
  }
  let totalSKUs = allVariants.length

  // procesar datos de provaltec
  const data = await new Promise((resolve, reject) => {
    req.getConnection((error, conexion) => {
      if (error) {
        reject(error)
      } else {
        conexion.query(
          "SELECT P.cod_unificado, S.stock FROM stock S LEFT JOIN productos P ON P.id=S.producto_id WHERE cod_unificado IS NOT NULL",
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
  // Machear el stock de shopify con el de provaltec
  const newVariants = allVariants.map((variant) => {
    const found = data.find((item) => item.cod_unificado === variant.sku)
    if (found) {
      variant.stockPvt = found.stock
    }
    return variant
  })

  const differenStock = newVariants.filter(
    (variant) => variant.stockShop != variant.stockPvt
  )
  let prodActualizados = differenStock.length

  let dataOfUpdate = []
  for (const updateItem of differenStock) {
    dataOfUpdate.push({
      location_id: process.env.SHOPIFY_LOCATATION_ID,
      inventory_item_id: updateItem.variantId,
      available: updateItem.stockPvt,
    })
  }
  updateStock(dataOfUpdate)
  res.json({
    message: "Proceso masivo realizado",
    totalSKUs: totalSKUs,
    skusActualizados: prodActualizados,
  })
}
