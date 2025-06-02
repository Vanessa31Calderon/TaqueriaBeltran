/* Este archivo configura un servidor utilizando Express. Incluye rutas para manejar solicitudes relacionadas 
con los modelos del sistema, como usuarios, pedidos, ventas, inventario, mesas y productos. También define 
un endpoint para crear nuevos usuarios en la base de datos. */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const app = express();
const puerto = 3000;
const usuario = require('./modelos/usuarios');
const detalle_pedido = require('./modelos/detalle_pedido');
const pedido = require('./modelos/pedido');
const venta = require('./modelos/venta');
const inventario = require('./modelos/inventario');
const mesa = require('./modelos/mesa');
const producto = require('./modelos/producto');
const { Op, where } = require('sequelize');

// Configurar middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Servir archivos estáticos
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/recursos', express.static(path.join(__dirname, '../recursos')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ruta para servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../html/index.html'));
});

// Middleware para verificar el rol del usuario
function verificarRol(rolPermitido) {
    return (req, res, next) => {
        const rol = req.cookies.rol || req.query.rol;
        if (rol !== rolPermitido) {
            return res.status(403).send('Acceso denegado. No tienes permiso para acceder a esta página.');
        }
        next();
    };
}

/* =========================
   RUTAS Y OPCIONES DEL ADMIN
   ========================= */

// Usuarios (solo admin)
app.post('/usuario', verificarRol('administrador'), async (req, res) => {
    const { nombres, ap_paterno, ap_materno, correo, contraseña, rol } = req.body;
    try {
        const data = await usuario.create({
            nombres,
            ap_paterno,
            ap_materno,
            correo,
            contraseña,
            rol,
        });
        res.send(data);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).send('Error interno del servidor.');
    }
});
app.get('/usuario', verificarRol('administrador'), async (req, res) => {
    const data = await usuario.findAll();
    res.send(data);
});
app.put('/usuario/:id', verificarRol('administrador'), async (req, res) => {
  try {
    const { id } = req.params;
    const { nombres, ap_paterno, ap_materno, correo, contraseña, rol } = req.body;

    // Validar usuario existente
    const user = await usuario.findOne({ where: { id_usuario: id } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Actualizar usuario
    const data = await usuario.update({
      nombres, ap_paterno, ap_materno, correo, contraseña, rol
    }, {
      where: { id_usuario: id }
    });

    res.json(data);
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});
app.get('/usuario/:id', verificarRol('administrador'), async (req, res) => {
  try {
    const { id } = req.params;
    const user = await usuario.findOne({ where: { id_usuario: id } });

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json(user);
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ error: 'Error interno al obtener usuario' });
  }
});

app.delete('/usuario/:id', verificarRol('administrador'), async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await usuario.destroy({
            where: { id_usuario: id }
        });
        if (!eliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ success: true });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

// Productos (solo admin)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/')); // crea la carpeta 'uploads' si no existe
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Endpoint para guardar un producto desde --- Admin/Comidas.html ----
app.post('/api/productocomida', verificarRol('administrador'), upload.single('imagen'), async (req, res) => {
    const { nombre, precio, categoria, descripcion } = req.body;
    const imagen = req.file ? '/uploads/' + req.file.filename : null;

    try {
        const nuevoProducto = await producto.create({
            nombre,
            precio,
            categoria,
            descripcion,
            imagen
        });
        res.status(201).json({ success: true, producto: nuevoProducto });
    } catch (error) {
        console.error('Error al guardar producto:', error);
        res.status(500).json({ success: false, message: 'Error al guardar el producto.' });
    }
});
// Endpoint para agregar productos desde --- Admin/Bebidas.html ---
app.post('/api/productobebidas', verificarRol('administrador'), upload.single('imagen'), async (req, res) => {
    const { nombre, precio, marca, stock_actual, descripcion, categoria } = req.body;
    const imagen = req.file ? '/uploads/' + req.file.filename : null;

    try {
        const nuevoProducto = await producto.create({
            nombre,
            precio,
            categoria,
            marca,
            stock_actual,
            descripcion,
            imagen
        });
        res.status(201).json({ success: true, producto: nuevoProducto });
    } catch (error) {
        console.error('Error al guardar producto:', error);
        res.status(500).json({ success: false, message: 'Error al guardar el producto.' });
    }
});

// Endpoint para agregar productos desde Admin/Postres.html
app.post('/api/productopostre', verificarRol('administrador'), upload.single('imagen'), async (req, res) => {
  const { nombre, precio, descripcion, stock_actual, categoria } = req.body;
  const imagen = req.file ? '/uploads/' + req.file.filename : null;

  try {
    const nuevoProducto = await producto.create({
      nombre,
      precio,
      categoria,
      descripcion,
      stock_actual,
      imagen
    });
    res.status(201).json({ success: true, producto: nuevoProducto });
  } catch (error) {
    console.error('Error al guardar producto:', error);
    res.status(500).json({ success: false, message: 'Error al guardar el producto.' });
  }
});
// endopoint para actualizar y buscar productos por id
app.get('/producto/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const prod = await producto.findOne({ where: { id_producto: id } });

    if (!prod) return res.status(404).json({ error: 'Producto no encontrado' });

    res.json(prod);
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({ error: 'Error interno al obtener producto' });
  }
});
app.put('/producto/:id', verificarRol('administrador'), async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, categoria, marca, precio, stock_actual, stock_minimo } = req.body;

    const productoEncontrado = await producto.findOne({ where: { id_producto: id } });
    if (!productoEncontrado) return res.status(404).json({ error: 'Producto no encontrado' });

    await productoEncontrado.update({
      nombre,
      descripcion,
      categoria,
      marca,
      precio,
      stock_actual,
      stock_minimo
    });

    res.json({ mensaje: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});
// endpoint para eliminar un producto
app.delete('/producto/:id', verificarRol('administrador'), async (req, res) => {
  try {
    const { id } = req.params;

    const productoEncontrado = await producto.findOne({ where: { id_producto: id } });
    if (!productoEncontrado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await productoEncontrado.destroy();

    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

app.get('/producto', verificarRol('administrador'), async (req, res) => {
    try {
        const productos = await producto.findAll();
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ success: false, message: 'Error al obtener productos.' });
    }
});

// Endpoint para subir una imagen de un producto
app.post('/api/upload', verificarRol('administrador'), upload.single('imagen'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No se ha subido ninguna imagen.' });
    }
    const rutaImagen = req.file.path; // Ruta de la imagen subida
    res.status(200).json({ success: true, path: rutaImagen });
});

// Ventas (solo admin)


// Rutas de páginas solo para admin
app.get('/html/Admin/inicioAdmin.html', verificarRol('administrador'), (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Admin/inicioAdmin.html'));
});
app.get('/html/Admin/AdministrarEmpleados', verificarRol('administrador'), (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Admin/AdministrarEmpleados.html'));
});
app.get('/html/Admin/MostrarEmpleados.html', verificarRol('administrador'), (req, res) => {
  res.sendFile(path.join(__dirname, '../html/Admin/MostrarEmpleados.html'));
});
app.get('/html/Admin/AdministrarEmpleados.html', verificarRol('administrador'), (req, res) => {
  res.sendFile(path.join(__dirname, '../html/Admin/AdministrarEmpleados.html'));
});
app.get('/html/Admin/ActualizarEmpleados.html', verificarRol('administrador'), (req, res) => {
  res.sendFile(path.join(__dirname, '../html/Admin/ActualizarEmpleados.html'));
});
app.get('/html/Admin/AgregarProductos.html', verificarRol('administrador'), (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Admin/AgregarProductos.html'));
});
app.get('/html/Admin/Bebidas.html', verificarRol('administrador'), (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Admin/Bebidas.html'));
});
app.get('/html/Admin/Comidas.html', verificarRol('administrador'), (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Admin/Comidas.html'));
});
app.get('/html/Admin/Empleados.html', verificarRol('administrador'), (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Admin/Empleados.html'));
});
app.get('/html/Admin/GenerarReporte.html', verificarRol('administrador'), (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Admin/GenerarReporte.html'));
});
app.get('/html/Admin/ModificarInventario.html', verificarRol('administrador'), (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Admin/ModificarInventario.html'));
});
app.get('/html/Admin/ModificarEmpleados.html', verificarRol('administrador'), (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Admin/ModificarEmpleados.html'));
});
app.get('/html/Admin/Postres.html', verificarRol('administrador'), (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Admin/Postres.html'));
});


/* =========================
   RUTAS Y OPCIONES DEL MESERO
   ========================= */

// Pedidos (mesero)
app.post('/pedido', async (req, res) => {
  try {
    const { id_usuario, id_mesa, id_producto, id_persona, cantidad_productos } = req.body;
    const data = await pedido.create({
      id_usuario,
      id_mesa,
      id_producto,
      id_persona,
      cantidad_productos
    });
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el pedido', error: error.message });
  }
});

app.get('/pedido', verificarRol('mesero'), async (req, res) => {
    const { id_mesa } = req.query;
    let where = {};
    if (id_mesa) where.id_mesa = id_mesa;
    const data = await pedido.findAll({ where });
    res.send(data);
});

app.put('/pedido/:id_pedido', verificarRol('mesero'), async (req, res) => {
    const { id_pedido } = req.params;
    const { id_usuario, id_mesa, id_producto, id_persona, cantidad_productos } = req.body;
    const data = await pedido.update({
        id_usuario, id_mesa, id_producto, id_persona, cantidad_productos
    }, {
        where: { id_pedido }
    });
    res.send(data);
});
app.delete('/pedido/:id_pedido', verificarRol('mesero'), async (req, res) => {
    const { id_pedido } = req.params;
    const data = await pedido.destroy({
        where: { id_pedido }
    });
    res.send(data);
});

// Eliminar todos los pedidos de una mesa (mesero) - ahora con DELETE y parámetro en URL
app.delete('/pedido/eliminar-por-mesa/:id_mesa', verificarRol('mesero'), async (req, res) => {
    const { id_mesa } = req.params;
    if (!id_mesa) return res.status(400).json({ error: 'Falta id_mesa' });
    try {
        const eliminados = await pedido.destroy({ where: { id_mesa } });
        res.json({ success: true, eliminados });
    } catch (error) {
        console.error('Error al eliminar pedidos por mesa:', error);
        res.status(500).json({ error: 'Error al eliminar pedidos por mesa' });
    }
});

const { Sequelize } = require('sequelize'); // Asegúrate de tener Sequelize importado

app.post('/pedido/por-mesa', async (req, res) => {
    const { id_mesa } = req.body;

    if (!id_mesa) return res.status(400).json({ error: 'Falta id_mesa' });

    try {
        const result = await pedido.sequelize.query(`
            SELECT 
              pedido.id_pedido,
              pedido.id_persona,
              productos.nombre, 
              productos.categoria, 
              pedido.cantidad_productos, 
              productos.precio 
            FROM pedido
            JOIN productos ON pedido.id_producto = productos.id_producto
            WHERE pedido.id_mesa = :id_mesa
            ORDER BY pedido.id_persona ASC
        `, {
            replacements: { id_mesa },
            type: Sequelize.QueryTypes.SELECT // Usa Sequelize directamente
        });

        res.json(result); // Aquí result es un arreglo con todas las filas
    } catch (error) {
        console.error(error); // Imprimir error para depuración
        res.status(500).json({ error: 'Error al obtener pedidos por mesa' });
    }
});



// Detalle Pedido (mesero)
app.post('/detalle_pedido', verificarRol('mesero'), async (req, res) => {
    const { id_producto, id_pedido, cantidad } = req.body;
    const data = await detalle_pedido.create({
        id_producto, id_pedido, cantidad
    });
    res.send(data);
});
app.get('/detalle_pedido', verificarRol('mesero'), async (req, res) => {
    const data = await detalle_pedido.findAll();
    res.send(data);
});
app.put('/detalle_pedido/:id', verificarRol('mesero'), async (req, res) => {
    const { id } = req.params;
    const { id_producto, id_pedido, cantidad } = req.body;
    const data = await detalle_pedido.update({
        id_producto, id_pedido, cantidad
    }, {
        where: { id }
    });
    res.send(data);
});
app.delete('/detalle_pedido/:id', verificarRol('mesero'), async (req, res) => {
    const { id } = req.params;
    const data = await detalle_pedido.destroy({
        where: { id }
    });
    res.send(data);
});

// Ventas (mesero)
app.post('/venta', verificarRol('mesero'), async (req, res) => {
    const { id_usuario, nombre, categoria, cantidad_productos, precio } = req.body;
    const data = await venta.create({
        id_usuario, nombre, categoria, cantidad_productos, precio
    });
    res.send(data);
});
// Nuevo endpoint POST para reporte de ventas por rango de fechas (por body)
app.post('/venta/reporte', /*verificarRol('administrador'),*/ async (req, res) => {
    const { fechaInicio, fechaFin } = req.body;
    if (!fechaInicio || !fechaFin) {
        return res.json([]);
    }
    try {
        const ventas = await venta.sequelize.query(
            `SELECT * FROM venta WHERE fecha_hora_venta BETWEEN :fechaInicio AND :fechaFin`,
            {
                replacements: {
                    fechaInicio: fechaInicio + ' 00:00:00',
                    fechaFin: fechaFin + ' 23:59:59'
                },
                type: Sequelize.QueryTypes.SELECT
            }
        );
        res.json(ventas);
    } catch (error) {
        console.error('Error al obtener ventas por rango:', error);
        res.status(500).json({ error: 'Error al obtener ventas por rango' });
    }
});
app.put('/venta/:id', verificarRol('mesero'), async (req, res) => {
    const { id } = req.params;
    const { id_usuario, id_pedido, fecha } = req.body;
    const data = await venta.update({
        id_usuario, id_pedido, fecha
    }, {
        where: { id }
    });
    res.send(data);
});
app.delete('/venta/:id', verificarRol('mesero'), async (req, res) => {
    const { id } = req.params;
    const data = await venta.destroy({
        where: { id }
    });
    res.send(data);
});

// Rutas de páginas solo para mesero
app.get('/html/Mesero/inicioMesero.html', verificarRol('mesero'), (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Mesero/inicioMesero.html'));
});
app.get('/html/Mesero/seleccionarMesa.html', verificarRol('mesero'), (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Mesero/seleccionarMesa.html'));
});
app.get('/html/Mesero/disponibilidadMesas.html', verificarRol('mesero'), (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Mesero/disponibilidadMesas.html'));
});
app.get('/html/Mesero/nuevaPersona.html', verificarRol('mesero'), (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Mesero/nuevaPersona.html'));
});
app.get('/html/Mesero/tomarPedido.html', verificarRol('mesero'), (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Mesero/tomarPedido.html'));
});
app.get('/html/Mesero/comidasFiltradas.html', verificarRol('mesero'), (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Mesero/comidasFiltradas.html'));
});
app.get('/html/Mesero/bebidasFiltradas.html', verificarRol('mesero'), (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Mesero/bebidasFiltradas.html'));
});
app.get('/html/Mesero/postresFiltrados.html', verificarRol('mesero'), (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Mesero/postresFiltrados.html'));
});
app.get('/html/Mesero/visualizarOrden.html', verificarRol('mesero'), (req, res) => {
    res.sendFile(path.join(__dirname, '../html/Mesero/visualizarOrden.html'));
});


/* =========================
   AUTENTICACIÓN (AMBOS ROLES)
   ========================= */

// Ruta para manejar el inicio de sesión
app.post('/api/login', async (req, res) => {
    const { correo, contraseña } = req.body;
    try {
        const user = await usuario.findOne({ where: { correo } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        }
        if (contraseña !== user.contraseña) {
            return res.status(401).json({ success: false, message: 'Contraseña incorrecta.' });
        }
        res.cookie('rol', user.rol, { httpOnly: true });
        const rol = user.rol;
        if (rol === 'mesero') {
            return res.json({ user, success: true, redirect: '/html/Mesero/inicioMesero.html' });
        } else if (rol === 'administrador') {
            return res.json({ user, success: true, redirect: '/html/Admin/inicioAdmin.html' });
        } else {
            return res.status(403).json({ success: false, message: 'Rol desconocido.' });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});

// Endpoint para obtener comidas filtradas por "asada" o "tripa" (solo mesero)
app.get('/api/comidas-filtradas', verificarRol('mesero'), async (req, res) => {
    try {
        const comidas = await producto.findAll({
            where: {
                categoria: {
                    [Op.or]: [
                        { [Op.like]: '%Asada%' },
                        { [Op.like]: '%Tripa%' }
                    ]
                }
            }
        });
        res.json(comidas);
    } catch (error) {
        console.error('Error al obtener comidas filtradas:', error);
        res.status(500).json({ success: false, message: 'Error al obtener comidas filtradas.' });
    }
});

// Endpoint para obtener bebidas filtradas por "refresco" o "agua" (solo mesero)
app.get('/api/bebidas-filtradas', verificarRol('mesero'), async (req, res) => {
    try {
        const bebidas = await producto.findAll({
            where: {
                categoria: {
                    [Op.or]: [
                        { [Op.iLike]: '%Refresco%' },
                        { [Op.iLike]: '%Agua%' }
                    ]
                }
            }
        });
        res.json(bebidas);
    } catch (error) {
        console.error('Error al obtener bebidas filtradas:', error);
        res.status(500).json({ success: false, message: 'Error al obtener bebidas filtradas.' });
    }
});

// Endpoint para obtener postres filtrados (solo mesero)
app.get('/api/postres-filtrados', verificarRol('mesero'), async (req, res) => {
    try {
        const postres = await producto.findAll({
            where: {
                categoria: {
                    [Op.iLike]: '%Postre%'
                }
            }
        });
        res.json(postres);
    } catch (error) {
        console.error('Error al obtener postres filtrados:', error);
        res.status(500).json({ success: false, message: 'Error al obtener postres filtrados.' });
    }
});

// Endpoint para obtener todas las mesas (solo mesero)
app.get('/api/mesas', verificarRol('mesero'), async (req, res) => {
    try {
        const mesas = await mesa.findAll();
        res.json(mesas);
    } catch (error) {
        console.error('Error al obtener mesas:', error);
        res.status(500).json({ success: false, message: 'Error al obtener mesas.' });
    }
});

// Iniciar el servidor
app.listen(puerto, () => {
    console.log(`Servidor iniciado en http://localhost:${puerto}`);
});