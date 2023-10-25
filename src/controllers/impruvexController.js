export const verificarAsn = async (req, res) => {
    const post = req.body
    const subPost = req.body.listaCajas // get nested

    await req.getConnection(async (error, conexion) => {
        if (error) return res.send(error)
        subPost.forEach(e => {
            const sql = 'INSERT INTO recepciones_invas VALUES (?,?,?,?,?,?);'
            conexion.query(sql, [, post.fecharecep, post.idasn, e.sku, e.unidades, 0], (err, results) => {
                if (err) return console.log(err)
                res.json({
                    "data": true,
                    "messaje": "Datos Recibidos",
                    "columnasAfectadas": results.affectedRows,
                    "alertas": results.warningCount,
                })
            })
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