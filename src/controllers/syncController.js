import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { AwsRequestSigner } from "google-auth-library/build/src/auth/awsrequestsigner";
/*
Config google
*/

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
];
const credenciales = new JWT({
  email: process.env.GOOGLE_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY,
  scopes: SCOPES,
});

export const insertDataToFile = async (req, res) => {
  // consultar la base datos y traer los datos
  const datos = await new Promise(async (resolve, reject) => {
    await req.getConnection((error, conexion) => {
      if (error) {
        reject(error)
      } else {
        conexion.query(
          "SELECT P.cod_unificado,P.id, IF(ISNULL(L.precio_dis),0,L.precio_dis) precio,P.no_vigente FROM productos P LEFT JOIN lista_precios_dis L ON L.producto_id=P.id WHERE L.periodo_id=3;",
          (err, data) => {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          }
        );
      }
    });
  });
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_ID_FILE, credenciales);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["matriz (NO BORRAR)"]

    if (sheet.length === 0) {
      res.json({ message: "Error, no existe la hoja" })
    } else {
      await sheet.clearRows();
    }

    await sheet.addRows(datos);
    res.json({
      message: "Registros actualizados",
      cantRegistros: datos.length,
    });
  } catch (error) {
    console.error(error);
    res.json({ message: "Error con la conexion a google drive" });
  }
};
