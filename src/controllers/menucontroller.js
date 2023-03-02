/*
  ----------------------------------------------------------------
    Author: Sebastian Solis		
    Creation date: 28/12/2021
    Descripción: Obtain the menus of the green cards in the B2B,
    It gives us the ID and the name of the menu
    Implementation: API for Mobile version
  ----------------------------------------------------------------
*/
export const getMenuHome = async (req, res) => {
  await req.getConnection(async (error, conexion) => {
    conexion.connect();
    if (error) return res.send(error)
    await conexion.query('select id,descripcion "title" from super_categorias_com where menu = 0 and linea_id=1 and id <> 1 order by id asc', (err, data) => {
      if (err) return res.send(err)
      res.json({
        "data": true,
        "messaje": "Datos Obtenidos",
        "results": data
      })
      conexion.end();
    })
  })
}

/*
----------------------------------------------------------------
    Author: Sebastian Solis		
    Creation date: 08/02/2022
    Descripción: Deliver the links of social networks. The
    information is static.
    Implementation: API for Mobile version
----------------------------------------------------------------
*/
export const getRRSS = async (req, res) => {
  const rrss = [
    {
      "icon": "mdi-facebook",
      "Url": "https://www.facebook.com/provalteccl"
    },
    {
      "icon": "mdi-youtube",
      "Url": "https://www.youtube.com/channel/UCW-YyJqRU3w_gu7Oo_4KrXA"
    },
    {
      "icon": "mdi-whatsapp",
      "Url": "https://wa.me/message/4QL3SCVJ7BHQG1"
    },
    {
      "icon": "mdi-instagram",
      "Url": "https://www.instagram.com/provaltec/"
    }]
  res.json({
    "data": true,
    "messaje": "Datos Obtenidos",
    "results": rrss
  })
}