/* Este archivo maneja el proceso de inicio de sesión. Busca al usuario en la base de datos utilizando 
su correo, verifica que la contraseña ingresada sea correcta comparándola con la almacenada, y devuelve 
un mensaje indicando si el inicio de sesión fue exitoso o no. */

const usuario = require('../modelos/usuarios'); // Modelo de usuarios

async function login(correo, contraseña) {
  try {
    // Buscar al usuario por correo
    const user = await usuario.findOne({ where: { correo } });

    if (!user) {
      return { success: false, message: 'Usuario no encontrado.' };
    }

    // Verificar la contraseña directamente
    if (contraseña !== user.contraseña) {
      return { success: false, message: 'Contraseña incorrecta.' };
    }

    // Si todo es correcto
    return { success: true, message: 'Inicio de sesión exitoso.', user };
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return { success: false, message: 'Error interno del servidor.' };
  }
}

module.exports = login;

