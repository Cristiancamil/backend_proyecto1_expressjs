// =====================================
// MIDDLEWARE DE AUTENTICACIÓN CON JWT
// =====================================
// Verifica la validez del token JWT enviado en los encabezados de la solicitud.
// Si el token es válido, permite el acceso a rutas protegidas.
// Si no lo es, responde con un error de autenticación.


// Se importa jwt desde el paquete jsonwebtoken
const jwt = require('jsonwebtoken')

/**
 * Middleware que verifica la validez de un token JWT enviado en el header 'Authorization'.
 *
 * - Si no se proporciona el token, responde con estado 401 (No autorizado).
 * - Si el token es inválido o ha expirado, responde con estado 403 (Prohibido).
 * - Si el token es válido, añade los datos decodificados a `req.user` y continúa con la solicitud.
 *
 * @param {Object} req - Objeto de solicitud HTTP (Request)
 * @param {Object} res - Objeto de respuesta HTTP (Response)
 * @param {Function} next - Función para pasar al siguiente middleware
 */
function authenticateToken (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]
  if (!token) 
    return res.status(401).json({ error: 'Acces Denied, no token provided'})
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if(err) return res.status(403).json({ error: 'Invalid token' })

    req.user = user

    next()
  })
}

module.exports = authenticateToken