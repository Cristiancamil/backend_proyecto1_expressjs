// ==============================
// FUNCIONES DE VALIDACIÓN DE USUARIOS
// ==============================

/**
 * Valida si un correo electrónico tiene un formato correcto.
 * Utiliza una expresión regular para verificar estructura básica de email.
 * @param {string} email - Correo a validar
 * @returns {boolean}
 */
const isValidEmail = (email) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    return emailRegex.test(email)
}

/**
 * Valida que el nombre sea una cadena con al menos 3 caracteres.
 * @param {string} name - Nombre del usuario
 * @returns {boolean}
 */
const isValidName = (name) => {
    return typeof name === 'string' && name.length >= 3
}

/**
 * Verifica que el ID sea un número y que no se repita en la lista de usuarios.
 * @param {number} id - ID a validar
 * @param {Array} users - Lista de usuarios existentes
 * @returns {boolean}
 */
const isUniqueNumericId = (id, users) => {
    return typeof id === 'number' && !users.some(user => user.id === id)
}

/**
 * Valida un objeto de usuario según nombre, email e ID.
 * 
 * - Verifica formato del nombre y del correo.
 * - Asegura que el ID sea único (excepto si está siendo actualizado).
 * 
 * @param {Object} user - Objeto con datos del usuario
 * @param {Array} users - Lista completa de usuarios
 * @param {number} [userIdBeingUpdated] - ID actual (en caso de actualización)
 * @returns {{ isValid: boolean, error?: string }}
 */
const validateUser = (user, users, userIdBeingUpdated) => {
    const { name, email, id } = user

    if (!isValidName(name)) {
        return {isValid: false, error: 'El nombre debe tener al menos 3 caracteres.'}
    }
    if (!isValidEmail(email)) {
        return {isValid: false, error: 'El correo electrónico no es válido.'}
    }
    if (id !== userIdBeingUpdated  && !isUniqueNumericId(id, users)) {
        return {isValid: false, error: 'El ID debe ser númerico y único.'}
    }

    return { isValid: true }
}

// Exportación de funciones para uso en otros módulos
module.exports = {
    isValidName,
    isValidEmail,
    isUniqueNumericId,
    validateUser
}