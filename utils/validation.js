const isValidEmail = (email) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    return emailRegex.test(email)
}

const isValidName = (name) => {
    return typeof name === 'string' && name.length >= 3
}

const isUniqueNumericId = (id, users) => {
    return typeof id === 'number' && !users.some(user => user.id === id)
}

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

module.exports = {
    isValidName,
    isValidEmail,
    isUniqueNumericId,
    validateUser
}