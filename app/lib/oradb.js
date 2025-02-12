import oracledb from 'oracledb';
import responseFormat from "./nextResponseFormat"

async function initialize() {
  console.log("####################################################################")
  console.log(`${process.env.ORA_DATABASE_HOST}/${process.env.ORA_DATABASE_NAME}`)
  try {
    await oracledb.createPool({
      user: process.env.ORA_DATABASE_CLIENT,
      password: process.env.ORA_DATABASE_PASSWORD,
      connectString: `${process.env.ORA_DATABASE_HOST}/${process.env.ORA_DATABASE_NAME}`
    });
    console.log('Conexión a la base de datos establecida');
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err);
  }
}

async function close() {
  try {
    await oracledb.getPool().close(0);
    console.log('Conexión a la base de datos cerrada');
  } catch (err) {
    console.error('Error al cerrar la conexión a la base de datos:', err);
  }
}

async function executeQuery(query, binds = [], options = {}) {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const data = await connection.execute(query, binds, options);

    const rows = data.rows;
    const metaData = data.metaData;
    const formattedRows = rows.map(row => {
      let formattedRow = {};
      row.forEach((value, index) => {
        formattedRow[metaData[index].name.toLowerCase()] = value;
      });
      return formattedRow;
    });
    
    const res = responseFormat(formattedRows,200,false)
    return res
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    const res = responseFormat(data.rows,500,error.message)
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error al cerrar la conexión:', err);
      }
    }
  }
  
}

module.exports = {
  initialize,
  close,
  executeQuery
};
