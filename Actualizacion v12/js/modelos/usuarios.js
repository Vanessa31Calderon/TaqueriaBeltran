/* Este archivo de texto define los campos de la tabla `usuarios` en la base de datos, como el ID, nombres,
apellidos,correo, contraseña y rol. Permite que el sistema gestione y organice la información 
de los usuarios de manera eficiente. */

const { DataTypes } = require('sequelize')
const sequelize = require('../conexion')

const usuario = sequelize.define('usuario', {
    id_usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombres: { type: DataTypes.STRING },
    ap_paterno: { type: DataTypes.STRING },
    ap_materno: { type: DataTypes.STRING },
    correo: {  
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    contraseña: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rol: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},
{ timestamps: false });

module.exports = usuario;
