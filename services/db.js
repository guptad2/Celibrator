const Sequelize = require("sequelize");
const pgtools = require("pgtools");
const url = require("url");

const defaultDbUrl = "postgres://postgres:postgres@localhost:5432/mydb";

const dbUrl = process.env.DATABASE_URL || defaultDbUrl;

const db = new Sequelize(dbUrl, {
  logging: false
});

/**
 * Create a dbconfig object from the DB URL.
 *
 * @param {String} dbUrl - The DB URL. Leave empty to use the one from env.
 * @returns {Object} - dbconfig
 */
const config = dbUrl => {
  const u = url.parse(dbUrl);
  const auth = u.auth.split(":");
  return {
    name: u.pathname.slice(1), // strip off leading slash
    user: auth[0],
    password: auth[1],
    host: u.hostname,
    port: u.port
  };
};

/**
 * Create a dbconfig object from the DB URL.
 * @returns {Promise} - Promise resolved when the function finishes execution
 */
const initDb = async () => {
  const dbConfig = config(dbUrl);
  try {
    await pgtools.createdb(dbConfig, dbConfig.name);
  } catch (e) {
    return;
  }

  const createDataTable = `CREATE TABLE data
  (
      celibrationID bigint,
      urls text,
      person text,
      occasion text
  );`;

  await db.query(createDataTable);
};

async function insertEntry(celibrationID, urls, person, occasion) {
  await db.query(
    `INSERT INTO data VALUES(${celibrationID},  ${urls}, ${person}, ${occasion});`
  );
}

async function getRows() {
  const result = await db.query(`SELECT * FROM data`);
  console.log(JSON.stringify(result));
  return result;
}

async function getURLS(celibrationID) {
  const result = getRows(celibrationID);

  let urls;
  result[0].map(res => (urls = urls + ", " + res));
  return urls;
}

module.exports = {
  db,
  initDb,
  insertEntry,
  getRows,
  getURLS
};
