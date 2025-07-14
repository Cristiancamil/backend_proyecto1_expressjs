/**
 * Middleware para registrar información detallada de cada solicitud entrante.
 * 
 * - Registra en consola el método HTTP, la URL solicitada, la IP del cliente y la marca de tiempo.
 * - Calcula y muestra la duración total de la solicitud cuando la respuesta finaliza.
 * 
 * Ejemplo de salida:
 * [2025-07-10T20:00:00.000Z] GET /api/users - IP: ::1
 * [2025-07-10T20:00:00.000Z] Response: 200 - 15ms
 *
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 * @param {Function} next - Función para pasar al siguiente middleware
 */
const LoggerMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString()

    console.log(`[${timestamp} ${req.method} ${req.url} - IP: ${req.ip}]`)  
    
    const start = Date.now()

    res.on('finish', () => {
        const duration = Date.now() - start
        console.log(`[${timestamp} Response: ${res.statusCode} - ${duration}ms]`)
    })

    next()
}

module.exports = LoggerMiddleware