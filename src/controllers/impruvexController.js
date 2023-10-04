export const verificarAsn = async (req, res) => {
    const post = req.body
    const subPost = req.body.listaCajas // get nested 
    const insert = [
        [post.idasn, post.unenviadas, post.unrecibidas, post.fecharecep, post.fechacreacion, subPost[0].sku, subPost[0].unidades]
    ]
    await req.getConnection(async (error, conexion) => {
        if (error) return res.send(error)
        // await conexion.query('INSERT INTO nameTable VALUES ?;', insert, (err, data) => {
        //     if (err) return console.log(err)
        // })
        res.json({
            "data": true,
            "messaje": "Datos Recibidos",
            "results": insert

        })
    })
}
export const despachoExpress = async (req, res) => {
    const post = req.body.listaLpnDestino[0]
    const insert = [
        [post.sku, post.nombreProducto, post.descripcionProducto, post.unidades]
    ]
    await req.getConnection(async (error, conexion) => {
        if (error) return res.send(error)
        // await conexion.query('INSERT INTO nameTable VALUES ?;', insert, (err, data) => {
        //     if (err) return console.log(err)
        // })
        res.json({
            "data": true,
            "messaje": "Datos Recibidos",
            "results": insert
        })
    })
}