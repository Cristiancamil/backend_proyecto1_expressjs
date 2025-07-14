/**
 * Middleware global para el manejo centralizado de errores en la aplicación.
 * 
 * - Captura cualquier error que ocurra durante el ciclo de vida de una solicitud.
 * - Devuelve una respuesta en formato JSON con:
 *    - status: 'error'
 *    - statusCode: código de estado HTTP (por defecto 500)
 *    - message: mensaje de error
 *    - stack: (solo en entorno de desarrollo) traza del error
 * - También registra el error con marca de tiempo en consola.
 * 
 * @param {Object} err - Objeto de error capturado
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 * @param {Function} next - Función para pasar al siguiente middleware
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Ocurrió un Error inesperado'

  console.error(
    `[ERROR] ${new Date().toISOString()} - ${statusCode} - ${message}`
  )

  if (err.stack) {
    console.error(err.stack)
  }

  res.status(statusCode).json({ 
    status: 'error',
    statusCode,
    message, 
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

module.exports = errorHandler