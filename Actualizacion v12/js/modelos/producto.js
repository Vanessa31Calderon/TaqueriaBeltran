/* Este archivo define los campos de la tabla 'producto' en la base de datos. Incluye información como el 
ID del producto, nombre, categoría, marca, precio, stock actual y stock mínimo. Sirve para gestionar y 
organizar la información relacionada con los productos del sistema.  */

const { DataTypes } = require('sequelize')
const sequelize = require('../conexion')

const producto = sequelize.define('producto', {
    id_producto: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING },
    categoria: { type: DataTypes.STRING },
    marca: { type: DataTypes.STRING, allowNull: true },
    precio: { type: DataTypes.REAL },
    descripcion: { type: DataTypes.STRING },
    stock_actual: { type: DataTypes.INTEGER, allowNull: true }, 
    stock_minimo: { type: DataTypes.INTEGER, allowNull: true }, 
    imagen: {
      type: DataTypes.TEXT,
      allowNull: true
    }
},
{ timestamps: false });

module.exports = producto;

