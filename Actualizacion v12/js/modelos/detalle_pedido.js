const { DataTypes } = require('sequelize')
const sequelize = require('../conexion')

const detalle_pedido = sequelize.define('detalle_pedido', {
    id_detalle_pedido: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_pedido: {type: DataTypes.INTEGER},
    id_producto: {type: DataTypes.INTEGER},
    cantidad: {type: DataTypes.INTEGER}
},
{ timestamps: false });

module.exports = detalle_pedido;
