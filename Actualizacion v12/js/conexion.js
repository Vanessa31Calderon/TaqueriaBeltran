const Sequelize = require('sequelize');

/* const sequelize = new Sequelize('taqueria', 'avnadmin', 'AVNS_0rr7xLZ05gc5rHXHjYk', {
  host: 'pg-gracia-pg-jmgc.b.aivencloud.com',
  dialect: 'postgres',
  port: 24980,
}); */

const sequelize = new Sequelize({
  database: "taqueria",
  username: "avnadmin",
  password: "AVNS_0rr7xLZ05gc5rHXHjYk",
  host: "pg-gracia-pg-jmgc.b.aivencloud.com",
  port: 24980,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

// Probar la conexión
sequelize.authenticate()
  .then(() => {
    console.log('Conexión exitosa a la base de datos.');
  })
  .catch((error) => {
    console.error('No se pudo conectar a la base de datos:', error);
  });

module.exports = sequelize;