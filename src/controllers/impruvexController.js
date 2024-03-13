export const verificarAsn = async (req, res) => {
    const post = req.body
    const subPost = req.body.listaCajas // get nested
    await req.getConnection(async (error, conexion) => {
        if (error) return res.send(error)
        await subPost.forEach(e => {
            let sql = 'INSERT INTO recepciones_invas VALUES (?,?,?,?,?,?);'
            conexion.query(sql, [undefined, post.fecharecep, post.numoc, e.sku, e.unidades, 0], (err, rows) => {
                if (err) return console.log(err)
            })
        })
        await conexion.query('SELECT COUNT(id) row FROM recepciones_invas WHERE ocompra=?', [post.numoc], (err, rows) => {
            if (err) return console.log(err)
            res.json({
                "data": true,
                "DIresult": "Success",
                "DImsg": post.numoc,
                "messaje": "Datos Recibidos",
                "cantidadProductos": rows[0].row

            })
        })

    })
}
export const despachoExpress = async (req, res) => {
    const post = req.body.listaLpnDestino
    var fecha = new Date().getFullYear() + '-' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + new Date().getDate()).slice(-2)
    await req.getConnection(async (error, conexion) => {
        if (error) return res.send(error)
        await post.forEach(e => {
            let sql = 'INSERT INTO despachos_invas VALUES (?,?,?,?,?,?);'
            conexion.query(sql, [undefined, fecha, e.ordendesalida, e.sku, e.unidades, 0], (err, rows) => {
                if (err) throw err
            })
        })
        res.json(
            {
                "Results": [{
                    "data": true,
                    "ordendesalida": post[0].ordendesalida,
                    "DIresult": "Success",
                    "DImsg": "179116",
                    "messaje": "Datos Recibidos",
                }]

            })
    })
}