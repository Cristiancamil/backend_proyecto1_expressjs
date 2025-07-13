// ===============================
// SCRIPT DE SEEDING CON PRISMA
// ===============================

// Se importa PrismaClient desde el paquete @prisma/client
const { PrismaClient } = require('@prisma/client');

// Se instancia PrismaClient para poder interactuar con la base de datos
const prisma = new PrismaClient();

/**
 * Función principal que ejecuta la creación de múltiples usuarios en la base de datos.
 * Utiliza el método `createMany()` para insertar registros de manera masiva.
 */
async function main() {
  await prisma.users.createMany({
    data: [
      { name: 'Camilo', email: 'camilo@example.com' },
      { name: 'Cristina', email: 'cristina@example.com' },
    ],
  });

  console.log('Datos insertados correctamente.');
}

// Ejecuta la función principal y maneja posibles errores
main()
  .catch((e) => {
    console.error(e);           // Muestra el error en consola
    process.exit(1);            // Finaliza el proceso con código de error
  })
  .finally(async () => {
    await prisma.$disconnect(); // Cierra la conexión con la base de datos
  });
