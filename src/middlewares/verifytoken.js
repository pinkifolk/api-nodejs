/*
    Middleware of acces
*/
import jwt from 'jsonwebtoken'
import config from '../config'// Keyword and expiration

/*
------------------------------------------------------------
    Author: Sebastian Solis		
    Creation date: 15/01/2022
    Descripción: Verify that the token sent is valid
    through its verification module, use the key
    secret to validate, which comes from the config file
    Implementation: API for Mobile version
------------------------------------------------------------
*/
const verifyToken = (req, res, next) => {
    const tokenHeader = req.header('token')
    if (!tokenHeader) return res.status(401).json({ error: 'No Existe Token' })
    try {
        const verified = jwt.verify(tokenHeader, config.SECRET)
        req.user = verified
        next()
    } catch (error) {
        res.status(400).json({ error: 'Token No Es Válido' })
    }
}

module.exports = verifyToken
