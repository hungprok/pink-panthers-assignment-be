const db = require("./database");
const fs = require("fs");
const path = require("path");

const directory = "./uploads";
function getAll(tableName, callback) {
  db.any(`SELECT * FROM public."${tableName}" WHERE is_deleted = 'FALSE'`)
    .then((result) => {
      callback(null, result);
    })
    .catch((err) => {
      callback(err);
    });
}

function getSingle(tableName, id, callback) {
  db.any(`SELECT * FROM public."${tableName}" WHERE id = ${Number(id)}`)
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
    `INSERT INTO public."${tableName}" (id, title, description, images) SELECT COUNT(*) + 1, '${obj.title}', '${obj.description}', '${obj.images}' FROM public."${tableName}"`
  )
    .then((result) => {
      callback(null, "You added an item!");
    })
    .catch((err) => {
      callback(err);
    });
}

function updateSingle(tableName, id, obj, callback) {
  let query = [];
  for (const [key, value] of Object.entries(obj)) {
    query.push(`${key} = '${value}'`);
  }
  const script = `UPDATE public."${tableName}" SET ${query.join(
    ","
  )} WHERE id = '${id}'`;
  console.log(script);
  db.any(script)
    .then((result) => {
      callback(null, "You updated an item!");
    })
    .catch((err) => {
      callback(err);
    });
}

function deleteSingle(tableName, id, callback) {
  db.any(`DELETE FROM public."${tableName}" WHERE id=${id}`)
    .then((result) => {
      callback(null, "You deleted an item!");
    })
    .catch((err) => {
      callback(err);
    });
}

function cleanUpDir() {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${directory}:`, err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${filePath}:`, err);
          return;
        }

        console.log(`Deleted file: ${filePath}`);
      });
    });
  });
}

module.exports = {
  getAll,
  getSingle,
  add,
  updateSingle,
  deleteSingle,
  cleanUpDir,
};
