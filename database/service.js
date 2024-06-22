const db = require("./database");

function getAll(tableName, callback) {
  db.any(`SELECT * FROM public."${tableName}"`)
    .then((result) => {
      callback(null, result);
    })
    .catch((err) => {
      callback(err);
    });
}

function getSingle(tableName, id, callback) {
  db.any(`SELECT * FROM public."${tableName}" WHERE id = ${id}`)
    .then((result) => {
      if (result.length) {
        callback(null, result);
      } else {
        callback("That item doesn't exist");
      }
    })
    .catch((err) => {
      callback(err);
    });
}

function add(tableName, obj, callback) {
  db.any(
    `INSERT INTO ${tableName} (title, description, images) VALUES('${obj.title}', ${obj.description}, '${obj.images}'`
  )
    .then((result) => {
      callback(null, "You added an item!");
    })
    .catch((err) => {
      callback(err);
    });
}

function updateSingle(tableName, id, field, value, callback) {
  db.any(`UPDATE ${tableName} SET ${field} = ${value} WHERE id = ${id} returning id`)
    .then((result) => {
      if (result.length) {
        callback(null, "You updated an item!");
      } else {
        callback("That item doesn't exist");
      }
    })
    .catch((err) => {
      callback(err);
    });
}

function deleteSingle(tableName, id, callback) {
  db.any(`DELETE FROM ${tableName} WHERE id=${id} returning id`)
    .then((result) => {
      if (result.length) {
        callback(null, "You deleted an item!");
      } else {
        callback("That item doesn't exist");
      }
    })
    .catch((err) => {
      callback(err);
    });
}

module.exports = {
  getAll,
  getSingle,
  add,
  updateSingle,
  deleteSingle,
};
