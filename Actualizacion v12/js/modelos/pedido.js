/* Este archivo define los campos de la tabla 'pedido' en la base de datos. Incluye información como 
el ID del pedido, el ID del usuario, el ID de la mesa, el ID del producto, la cantidad de productos, el estado
del pedido, la fecha y hora del pedido, y el total. Sirve para gestionar y organizar la información relacionada
con los pedidos del sistema. */

const { DataTypes } = require('sequelize')
const sequelize = require('../conexion')

const pedido = sequelize.define('pedido', {
    id_pedido: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_usuario: {type: DataTypes.INTEGER},
    id_mesa: {type: DataTypes.INTEGER},
    id_producto: {type: DataTypes.INTEGER},
    id_persona: {type: DataTypes.INTEGER},
    cantidad_productos: {type: DataTypes.INTEGER},
},
{ timestamps: false,
  tableName: 'pedido'
});

module.exports = pedido;