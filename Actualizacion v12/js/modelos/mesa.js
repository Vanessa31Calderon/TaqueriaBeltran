/* Este archivo define los campos de la tabla 'mesa' en la base de datos. Incluye información como el ID de la mesa
y el estado del pedido. Sirve para gestionar y organizar la información relacionada con las mesas del sistema.*/

const { DataTypes } = require('sequelize')
const sequelize = require('../conexion')

const mesa = sequelize.define('mesa', {
    id_mesa: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    estado_pedido: {type: DataTypes.STRING},
},
{ timestamps: false,
    tableName: 'mesa',
});

module.exports = mesa;