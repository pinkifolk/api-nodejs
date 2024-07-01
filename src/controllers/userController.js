import config from '../config'// // Clave secreta y expiracion
import jwt from 'jsonwebtoken'// modulo para generar token
/*
        ----------------------------------------------------------------
        Author: Sebastian Solis		
        Creation date: 05/01/2022
        Descripción: Get the data of the logged in user to
        show them in the side menu section, get the %
        discount that the company has
        Implementation: API for Mobile version
        ----------------------------------------------------------------
*/
export const getDataUser = async (req, res) => {
    await req.getConnection(async (error, conexion) => {
        const { id } = req.params
        if (error) return res.send(error)
        await conexion.query('SELECT CONCAT(UCASE(LEFT(U.Nombre,1)),LCASE(SUBSTRING(U.Nombre,2))) nombre, CONCAT(UCASE(LEFT(U.apellidos,1)),LCASE(SUBSTRING(U.apellidos,2))) apellido, CONCAT(UCASE(LEFT(V.nombre,1)),LCASE(SUBSTRING(V.nombre,2))," ",UCASE(LEFT(V.apellidos,1)),LCASE(SUBSTRING(V.apellidos,2))) vendedor, D.descuento FROM usuarios_dis U JOIN vendedores_dis V ON V.id=U.vendedor_id JOIN empresas_dis E ON E.id=U.empresa_id JOIN descuentos D ON D.id=E.descuento_id WHERE U.id=?', [id], (err, data) => {
            if (err) return console.log(err)
            res.json({
                "data": true,
                "messaje": "Datos Obtenidos",
                "results": data
            })
        })
    })
}
/*
        ----------------------------------------------------------------
        Author: Sebastian Solis		
        Creation date: 07/01/2022
        Descripción: We look for the user who is logging in
        To see if it exists, we use the PASSWORD function to validate
        correctly the key and we respond with the id, the discount and the
        Authorization token so you can get the data.
        Implementation: API for Mobile version 
        ----------------------------------------------------------------
*/
export const login = async (req, res) => {
    const { clave, password } = req.body
    await req.getConnection(async (error, conexion) => {
        if (error) return res.send(error)
        await conexion.query('SELECT U.id, D.descuento FROM usuarios_dis U JOIN empresas_dis E ON E.id=U.empresa_id JOIN descuentos D ON D.id=E.descuento_id WHERE U.clave=? AND U.password=PASSWORD(?);', [clave, password], (err, data) => {
            if (err) return console.log(err)
            if (data.length == 0) {
                res.json({
                    "data": false,
                    "messaje": "Credenciales Incorrectas"

                })
            } else {
                // Creacion de token = id del usuario + descuento + clave secreta
                const token = jwt.sign({ id: data[0].id, descuento: data[0].descuento }, config.SECRET, {
                    expiresIn: config.EXPIRED
                })
                res.json({
                    "data": true,
                    "messaje": "Datos Obtenidos",
                    "id": data[0].id,
                    "descuento": data[0].descuento,
                    "token": token,
                })
            }

        })
    })
}