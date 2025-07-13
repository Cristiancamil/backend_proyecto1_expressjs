// ==============================
// IMPORTACIÓN DE MÓDULOS BÁSICOS
// ==============================
// - dotenv: carga variables de entorno desde un archivo .env.
// - express: framework web para construir la API REST.
// - PrismaClient: ORM para interactuar con la base de datos.
// Se instancia Prisma para usarlo en las rutas.
require('dotenv').config()
const express = require('express')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// =================
// MIDDLEWARES
// =================
// Se importan middlewares personalizados:
// - LoggerMiddleware: registra información de cada solicitud entrante.
// - errorHandler: captura y maneja errores de forma centralizada.
const LoggerMiddleware = require('./middlewares/logger')
const errorHandler = require('./middlewares/errorHandler')

// ======================
// VALIDACIONES DE DATOS
// ======================
// Se importa la función 'validateUser' desde el módulo de utilidades,
// utilizada para validar los datos de entrada en las rutas de usuarios.
const { validateUser } = require('./utils/validation')

// =========================
// IMPORTACIÓN DE LIBRERÍAS
// =========================
// Se importan módulos del núcleo de Node.js:
// - fs: para operaciones con archivos.
// - path: para manejar rutas de archivos de forma segura.
const fs = require('fs')
const path = require('path')

// =============================
// RUTA DEL ARCHIVO DE USUARIOS
// =============================
// Se obtiene la ruta absoluta del archivo 'users.json'
// ubicado en el mismo directorio del archivo actual.
const usersFilePath = path.join(__dirname, 'users.json')

// ========================
// CONFIGURACIÓN DE LA APP
// ========================
// Se instancia la aplicación Express y se configuran middlewares globales:
// - express.json(): para parsear cuerpos JSON.
// - express.urlencoded(): para formularios codificados.
// - LoggerMiddleware: para registrar peticiones.
// - errorHandler: middleware global de manejo de errores.
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(LoggerMiddleware)
app.use(errorHandler)

// =====================================
// CONFIGURACIÓN DEL PUERTO DEL SERVIDOR
// =====================================
//Asignación del puerto donde se ejecuta la aplicación.
//Se obtiene el puerto desde la variable de entorno `PORT` definida en el archivo `.env`.
//Si no está presente, se asigna por defecto el puerto 3000.
const PORT = process.env.PORT || 3000

// =======================
// RUTAS HTTP PRINCIPALES
// =======================
// Aquí se definen las rutas de la aplicación Express que manejan las solicitudes
// GET, POST, PUT, DELETE, etc.

/**
 * Ruta principal (home) de la aplicación backend
 * 
 * No recibe parámetros.
 * 
 * Devuelve una respuesta en formato HTML con una información básica de la aplicación.
 * 
 * Contenido devuelto:
 * - Un titulo profesional (`<h1>`) con el nombre del curso.
 * - Un parrafo descriptivo sobre la tecnología usada (Node.js y Express.js).
 * - Un parrafo con el puerto en el que se está ejecutando la aplicación
 * 
 * @route GET /
 * @returns {HTML} Página informativa en formato HTML
*/
app.get('/', (req, res) => {
  res.send(`
    <h1>Curso Express.js V2</h1>
    <p>Esto es una aplicación node.js con express.js</p>
    <p>Corre en el puerto: ${PORT}</p>
  `)
})

/**
 * Maneja el filtro de búsqueda a través de una solicitud GET
 * 
 * Recibe los parámetros `termino` y `categoría` desde `req.quiery`.
 * 
 * Si alguno de los parámetros no se proporciona, se asignan valores por defecto:
 * - `termino`: `No especificado`
 * - `categoria`: `Todas'
 * 
 * Devuelve una respuesta en formato HTML con un mensaje y los datos recibidos.
 * 
 * @route GET /search
 * @return {HTML} Página con los resultados de busqueda
*/
app.get('/search', (req, res) => {
  const terms = req.query.termino || 'No especificado'
  const category = req.query.categoria || 'Todas'
  res.send(`
    <h2>Resultados de Busqueda:</h2>
    <p>Terminos: ${terms}</p>
    <p>Categoría: ${category}</p>
  `)
})

/**
 * Maneja el envío de un formulario a través de una solicitud POST
 * 
 * Recibe los parámetros `name` y `email` desde `req.body`.
 * 
 * Si alguno de los parámetros no se proporciona, se asignan valores por defecto:
 * - `name`: 'Anónimo'
 * - `email`: 'No proporcionado'
 * 
 * Devuelve una respuesta en formato JSON con un mensaje y los datos recibidos.
 * 
 * @route POST /form
 * @returns {Object} JSON con el mensaje y los datos procesado
*/
app.post('/form', (req, res) => {
  const name = req.body.name || 'Anónimo'
  const email = req.body.email || 'No proporcionado'
  res.json({
    message: 'Datos recibidos',
    data: {
      name,
      email
    }
  })
})

/**
 * Maneja el envío de un formulario a travéz de una solicitud POST
 * 
 * Recibe un objeto JSON desde `req.body`.
 * Valida que se esté recibiendo; si no, responde con un error 400.
 * 
 * Si los datos son válidos, responde con un código 201 y el objeto recibido.
 * 
 * @route POST /api/data
 * @param {Object} req.body - Objeto JSON enviado en el cuerpo de la solicitud.
 * @return {JSON} Confirmación del recibo con los datos enviados.
 * 
*/
app.post('/api/data', (req, res) => {
  const data = req.body
  if(!data || Object.keys(data).length === 0) {
    return res.status(400).json({error: "No se recibieron datos"})
  }
  res.status(201).json({
    message: "Datos JSON recibidos",
    data
  })
})

/**
 * Maneja la solicitud GET para obtener la lista de usuarios desde un archivo JSON local.
 * 
 * Utiliza `fs.readFile` con codificación `utf-8` para leer el archivo especificado en `usersFilePath`.
 * 
 * - Si la lectura es exitosa, devuelve los usuarios como JSON.
 * - Si ocurre un error, responde con código 500 y un mensaje de error.
 * 
 * @route GET /users
 * @returns {JSON} Arreglo de usuarios o mensaje de error en caso de fallo
*/
app.get('/users', (req, res) => {
  fs.readFile(usersFilePath, 'utf-8', (err, data) => {
    if(err) {
      return res.status(500).json({error: 'Error con conexión de datos.'})
    }
    const users = JSON.parse(data)
    res.json(users)
  })
})

/**
 * Maneja la solicitud GET para obtener un usuario
 * 
 * Recibe el parámetro `id` desde `req.params`.
 * 
 * Devuelve un mensaje en formato HTML con un mensaje y los datos recibidos.
 * 
 * @route GET /users/:id
 * @returns {HTML} Página con los resultados de busqueda
*/
app.get('/users/:id', (req, res) => {
  const id = req.params.id
  res.send(`
    <h1>Mostrar información del usuario con ID: ${id}</h1>
  `)
})

/** 
 * Maneja el envío de un formulario para crear un usuario mediante una solicitud POST
 * 
 * Recibe un objeto JSON desde `req.body`.
 * Utiliza `fs.readFile` con codificación `utf-8` para leer el archivo específicado en `usersFilePath`.
 * 
 * - Si ocurre un error al leer el archivo, responde con código 500 y un mensaje de error.
 * - Si la lectura es exitosa, parsea la información del archivo.
 * 
 * Valida el nuevo usuario utilizando la función `validateUser`.
 * 
 * - Si la validación falla, responde con código 400 y un mensaje de error detallado.
 * 
 * Si la validación es correcta:
 * - Añade el nuevo usuario al arreglo existente.
 * - Utiliza `fs.writeFile` con codificación `utf-8` para sobrescribir el archivo actualizado.
 * - Si ocurre un error al guardar, responde con código 500 y un mensaje de error.
 * - Si se guarda correctamente, responde con código 201 y el objeto del nuevo usuario.
 * 
 * @route POST /users
 * @param {Object} req.body - Objeto JSON con los datos del nuevo usuario
 * @returns {JSON} Usuario creado o mensaje de error
*/
app.post('/users', (req, res) => {
  const newUser = req.body
  fs.readFile(usersFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error con conexión de datos.' })
    }
    const user = JSON.parse(data)

    const validation = validateUser(newUser, user)
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error })
    }

    user.push(newUser)
    fs.writeFile(usersFilePath, JSON.stringify(user, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al guardar el usuario.' })            
      }
      res.status(201).json(newUser)
    })
  })
})

/** 
 * Maneja la actualización de un usuario mediante una solicitud PUT
 * 
 * Recibe un ID de usuario como parámetro de ruta (`req.params.id`) y un objeto con los datos actualizados desde (`req.body`)
 * 
 * - Valida que se haya recibido un cuerpo de datos
 * - Lee el archivo de usuarios (`usersFilePath`) usando `fs.readFile` con codificación `utf-8`
 * - Si ocurre un error al leer el archivo, responde con código 500
 * 
 * Utiliza `validateUser` para validar los datos del usuario actualizado.
 * - Si la validación falla, responde con código 400 y el mensaje correspondiente.
 * 
 * Si todo es correcto:
 * - Actualiza el usuario correspondiente en el arreglo.
 * - Escribe los datos actualizados en el archivo utilizando `fs.writeFile`.
 * - Si hay error al escribir, responde con código 500.
 * - Si se guarda correctamente, responde con el usuario actualizado.
 * 
 * @route PUT /users/:id
 * @param {number} req.params.id - ID del usuario a actualizar
 * @param {Object} req.body - Datos actualizados del usuario
 * @returns {JSON} Usuario actualizado o mensaje de error 
*/
app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10)
  const updatedUser = req.body
  
  if (!updatedUser || Object.keys(updatedUser).length === 0){
    return res.status(500).json({ error: 'No se recibieron datos.'})
  }

  fs.readFile(usersFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error con conexión de datos.'})
    }
    let users = JSON.parse(data)

    const validation = validateUser(updatedUser, users, userId)
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error })
    }

    users = users.map( user => (user.id === userId ? {...user, ...updatedUser} : user ))

    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res
          .status(500)
          .json({error: 'Error al actualizar el usuario'})
      }
      res.json(updatedUser)
    })
  })
})

/**
 * Maneja la eliminación de un usuario mediante una solicitud DELETE.
 *
 * Recibe un ID de usuario como parámetro de ruta (`req.params.id`).
 *
 * - Lee el archivo de usuarios (`usersFilePath`) usando `fs.readFile` con codificación `utf-8`.
 * - Si ocurre un error al leer el archivo, responde con código 500.
 *
 * Filtra el arreglo para eliminar el usuario con el ID proporcionado.
 * - Escribe el nuevo arreglo en el archivo usando `fs.writeFile`.
 * - Si ocurre un error al escribir, responde con código 500.
 * - Si se elimina correctamente, responde con código 204 (sin contenido).
 *
 * @route DELETE /users/:id
 * @param {number} req.params.id - ID del usuario a eliminar
 * @returns {204 No Content | 500 Internal Server Error}
 */
app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10)
  fs.readFile(usersFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error con conexión de datos.' })
    }
    let users = JSON.parse(data)
    users = users.filter(user => user.id !== userId)
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al eliminar el usuario.' })
      }
      res.status(204).send()
    })
  })
})

/**
 * Ruta de prueba que genera un error intencional.
 *
 * Su objetivo es probar el middleware global de manejo de errores.
 * Llama a `next()` con una instancia de Error.
 *
 * @route GET /error
 * @throws {Error} Error intencional para pruebas
 */
app.get('/error', (req, res, next) => {
  next(new Error('Error intencional'))
})

/**
 * Obtiene la lista de usuarios desde la base de datos mediante una solicitud GET.
 *
 * Utiliza Prisma ORM para ejecutar `users.findMany()` y recuperar todos los registros de la tabla `users`.
 *
 * - Si la operación es exitosa, responde con un arreglo JSON de usuarios.
 * - Si ocurre un error al consultar la base de datos, responde con código 500 y un mensaje de error.
 *
 * @route GET /db-users
 * @returns {JSON} Lista de usuarios o mensaje de error en caso de fallo
 */
app.get('/db-users', async(req, res) => {
  try {
    const users = await prisma.users.findMany()
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Error al comunicarse con la base de datos' })
  }
})

// =======================
// INICIO DEL SERVIDOR
// =======================
// Se pone en marcha el servidor Express en el puerto definido.
// Muestra en consola la URL local para verificar que está activo.
/**
 * Inicia el servidor Express en el puerto definido por la constante `PORT`.
 *
 * Una vez iniciado, muestra un mensaje en la consola con la URL local del servidor.
 *
 * @function app.listen
 * @param {number} PORT - Puerto en el que se ejecuta el servidor
 */
app.listen(PORT, () => {
  console.log(`Servidor: http://localhost:${PORT}`)   
})