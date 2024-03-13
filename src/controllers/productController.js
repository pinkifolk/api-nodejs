/*
   ------------------------------------------------------------
   Author: Sebastian Solis		
   Creation date: 28/12/2021
   Descripción: Print the data from the following
   tables families_com,interface_n3_val,multimedia_fam,interface_n3_var
   and variables_uni. To generate a view of families
   According to its category, it returns the title, the description 1 2 3,
   the link of the image and the category
   Implementation: API for Mobile version
   ------------------------------------------------------------
*/
export const getProductsById = async (req, res) => {
    await req.getConnection(async (error, conexion) => {
        if (error) return res.send(error)
        const { id } = req.params
        await conexion.query('SELECT F.id, D.des_familia title,CONCAT(IF(ISNULL(I.des_columna1),V1.descripcion,I.des_columna1),": ",D.valor1) des_columna1,CONCAT(IF(ISNULL(I.des_columna2),V2.descripcion,I.des_columna2),": ",D.valor2) des_columna2,CONCAT(IF(ISNULL(I.des_columna3),V3.descripcion,I.des_columna3),": ",D.valor3) des_columna3,CONCAT("http://www.provaltec1.cl/distribuidores/admin/multimedia/",M.interno_imagen) urlImagen, F.subcategoria_com_id idMenu FROM familias_com F JOIN interfaz_n3_val D ON D.familia_id=F.id JOIN multimedia_fam M ON M.familia_id=F.id JOIN interfaz_n3_var I ON I.subcategoria_id=F.subcategoria_com_id JOIN variables_uni V1 ON V1.id=I.columna1 JOIN variables_uni V2 ON V2.id=I.columna2 JOIN variables_uni V3 ON V3.id=I.columna3 JOIN orden_filtros_fam O ON O.familia_com_id=F.id WHERE F.subcategoria_com_id =? ORDER BY O.orden ASC', [id], (err, data) => {
            if (err) return res.send(err)
            res.json({
                "data": true,
                "messaje": "Datos Obtenidos",
                "results": data
            })
        })
        conexion.end()
    })
}
/*
------------------------------------------------------------
    Author: Sebastian Solis		
    Creation date: 07/01/2022
    Descripción: An SP is created which obtains the
    characteristics of the families, the SP receives the id of the
    family that is needed This corresponds to the second
    family detail section
    Implementation: API for Mobile version
    Invoke: CALL getVariableFamily(id);
------------------------------------------------------------
*/
export const getVariablesById = async (req, res) => {
    await req.getConnection(async (error, conexion) => {
        const { id } = req.params
        if (error) return res.send(error)
        await conexion.query('CALL getVariableFamily(?)', [id], (err, data) => {
            if (err) return console.log(err)
            res.json({
                "data": true,
                "messaje": "Datos Obtenidos",
                "results": data
            })
        })
        conexion.end()
    })
}
/*
------------------------------------------------------------
    Author: Sebastian Solis		
    Creation date: 07/01/2022
    Descripción: Gets the first section of the detail of the
    family corresponding to the product photo, the title
    and the pdf of the file
    Implementation: API for Mobile version
------------------------------------------------------------
*/
export const getFamiliaMultimediaById = async (req, res) => {
    await req.getConnection(async (error, conexion) => {
        const { id } = req.params
        if (error) return res.send(error)
        await conexion.query('SELECT F.id, D.des_familia title, CONCAT("http://www.provaltec1.cl/distribuidores/admin/multimedia/",M.interno_imagen) urlImagen, CONCAT("http://www.provaltec1.cl/distribuidores/admin/multimedia/",M.interno_ficha) pdf FROM familias_com F JOIN interfaz_n3_val D ON D.familia_id=F.id  JOIN multimedia_fam M ON M.familia_id=F.id WHERE F.id=?', [id], (err, data) => {
            if (err) return console.log(err)
            res.json({
                "data": true,
                "messaje": "Datos Obtenidos",
                "results": data
            })
        })
        conexion.end()
    })
}
/*
------------------------------------------------------------
    Author: Eduardo Castillo		
    Creation date: 
    Descripción: Gets all product data for
    show them in the B2B
    Implementation: B2B and Api for Mobile version
    Edited by: Sebastian Solis
    Modification: Columns that are not needed are removed, and
    add price and stock
    Reviews: Review the possible measures they may have,
    Validate that the period is always correct
    Correction: It is confirmed that the measure will always be ANSI,
    Repeated codes that have stock are grouped into two
    different warehouses. Missing to validate the price period
------------------------------------------------------------
*/
export const getProductosById = async (req, res) => {
    await req.getConnection(async (error, conexion) => {
        const { id } = req.params
        if (error) return res.send(error)
        await conexion.query('SELECT B.id, B.ref_clon, B.cod_unificado, SUBSTRING(D.descripcion,1, CHAR_LENGTH(D.descripcion) - 1) AS medida, IF(ISNULL(S.stock),0,S.stock) provaltec, IF(ISNULL(SC.stock),0,SC.stock) consignacion, L.precio_dis precio FROM def_familias_com A LEFT JOIN productos B ON A.producto_id=B.id LEFT JOIN especificacion_producto C ON C.producto_id=B.id AND C.categoria_id=B.categoria_id AND C.variable_id=2 LEFT JOIN variables_valores D ON D.id=C.variable_valor_id LEFT JOIN orden_filtros_med D2 ON D2.variable_valor_id=D.id LEFT JOIN lista_precios_dis L ON L.producto_id=B.id LEFT JOIN pvt1_sistema.stock S ON S.producto_id=B.id LEFT JOIN pvt1_sistema.stock SC ON SC.producto_id=B.ref_clon WHERE A.familia_com_id=? AND L.periodo_id=3 GROUP BY S.producto_id ORDER BY D2.orden;', [id], (err, data) => {
            if (err) return console.log(err)
            res.json({
                "data": true,
                "messaje": "Datos Obtenidos",
                "results": data
            })
        })
        conexion.end()
    })
}
/*
------------------------------------------------------------
    Author: Sebastian Solis
    Creation date: 25/01/2022
    Descripción: Gets all data from pools
    of products, which are represented by the
    green tabs in the B2B to show it in the version
    mobile
    Implementation: API for Mobile version
------------------------------------------------------------
*/
export const getProductosInicioById = async (req, res) => {
    await req.getConnection(async (error, conexion) => {
        const { id } = req.params
        if (error) return res.send(error)
        await conexion.query('SELECT F.nodo_patron id, D.des_familia title, CONCAT(IF(ISNULL(I.des_columna1),V1.descripcion,I.des_columna1),": ",D.valor1) des_columna1, CONCAT(IF(ISNULL(I.des_columna2),V2.descripcion,I.des_columna2),": ",D.valor2) des_columna2, CONCAT(IF(ISNULL(I.des_columna3),V3.descripcion,I.des_columna3),": ",D.valor3) des_columna3, CONCAT("http://www.provaltec1.cl/distribuidores/admin/multimedia/",M.interno_imagen) urlImagen, C.super_categoria_com_id idMenu FROM familias_com F JOIN categorias_com C ON C.id=F.categoria_com_id JOIN interfaz_n3_val D ON D.familia_id=F.nodo_patron JOIN multimedia_fam M ON M.familia_id=F.nodo_patron JOIN subcategorias_com SC ON SC.id=F.subcategoria_com_id LEFT JOIN interfaz_n3_var I ON I.subcategoria_id=SC.nodo_patron LEFT JOIN variables_uni V1 ON I.columna1=V1.id LEFT JOIN variables_uni V2 ON I.columna2=V2.id LEFT JOIN variables_uni V3 ON I.columna3=V3.id WHERE F.nodo_patron IS NOT NULL AND C.super_categoria_com_id=? ORDER BY C.descripcion ASC', [id], (err, data) => {
            if (err) return console.log(err)
            res.json({
                "data": true,
                "messaje": "Datos Obtenidos",
                "results": data
            })
        })
        conexion.end()
    })
}
/*
------------------------------------------------------------
    Author: Sebastian Solis
    Creation date: 26/01/2022
    Descripción: Gets the families associated with the menu
    Bronze Valve and Fire Network
    Implementation: API for Mobile version
------------------------------------------------------------
*/
export const getProductsSpecialById = async (req, res) => {
    await req.getConnection(async (error, conexion) => {
        const { id } = req.params
        if (error) return res.send(error)
        await conexion.query('SELECT F.nodo_patron id, D.des_familia title, CONCAT(IF(ISNULL(I.des_columna1),V1.descripcion,I.des_columna1),": ",D.valor1) des_columna1, CONCAT(IF(ISNULL(I.des_columna2),V2.descripcion,I.des_columna2),": ",D.valor2) des_columna2, CONCAT(IF(ISNULL(I.des_columna3),V3.descripcion,I.des_columna3),": ",D.valor3) des_columna3, CONCAT("http://www.provaltec1.cl/distribuidores/admin/multimedia/",M.interno_imagen) urlImagen, F.categoria_com_id idMenu FROM familias_com F JOIN interfaz_n3_val D ON D.familia_id=F.nodo_patron JOIN multimedia_fam M ON M.familia_id=F.nodo_patron JOIN subcategorias_com SC ON SC.id=F.subcategoria_com_id LEFT JOIN interfaz_n3_var I ON I.subcategoria_id=SC.nodo_patron LEFT JOIN variables_uni V1 ON I.columna1=V1.id LEFT JOIN variables_uni V2 ON I.columna2=V2.id LEFT JOIN variables_uni V3 ON I.columna3=V3.id JOIN orden_filtros_fam O ON O.familia_com_id=F.nodo_patron WHERE F.categoria_com_id=? ORDER BY O.orden;', [id], (err, data) => {
            if (err) return console.log(err)
            res.json({
                "data": true,
                "messaje": "Datos Obtenidos",
                "results": data
            })
        })
        conexion.end()
    })
}

