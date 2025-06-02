/*Este archivo define los campos de la tabla 'inventario' en la base de datos. Incluye información como el ID 
del movimiento, el ID de los productos, el tipo de movimiento, la cantidad y la fecha y hora. Sirve para gestionar
y registrar los movimientos del inventario de manera organizada. */

const { DataTypes } = require('sequelize')
const sequelize = require('../conexion')

const inventario = sequelize.define('inventario', {
    id_movimiento: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_productos: {type: DataTypes.INTEGER},
    tipo_movimiento: {type: DataTypes.STRING},
    cantidad: {type: DataTypes.INTEGER},
    fecha_hora: {type: DataTypes.DATE}
},
{ timestamps: false });

module.exports = inventario;
