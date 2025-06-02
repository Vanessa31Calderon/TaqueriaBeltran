/* Este archivo define los campos de la tabla `venta` en la base de datos. Incluye información como el ID 
de la venta, el ID de la mesa, el ID del usuario, el ID del pedido, la fecha y hora de la venta, la cantidad
de productos y el total. Sirve para gestionar y organizar la información relacionada con las ventas del sistema. */

const { DataTypes } = require('sequelize')
const sequelize = require('../conexion')

const venta = sequelize.define('venta', {
    id_venta: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_usuario: {type: DataTypes.INTEGER},
    nombre: {type: DataTypes.STRING},
    categoria: {type: DataTypes.STRING},
    cantidad_productos: {type: DataTypes.INTEGER},
    precio: {type: DataTypes.REAL},
    fecha_hora_venta: {type: DataTypes.DATE}
},
{ 
    timestamps: false,
    tableName: 'venta'
 });

module.exports = venta;  