var express = require("express");
var router = express.Router();
const dataService = require("../database/service");

router.get("/", async function (req, res, next) {
  dataService.getAll("Items", (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send(result);
    }
  });
});

router.post("/", async function (req, res, next) {
  console.log(req.body);
  const { title, description, images } = req.body;
  if (title && description) {
    return dataService.add(
      "Items",
      { title, description, images },
      (err, result) => {
        if (err) {
          next(err);
        } else {
          res.send(result);
        }
      }
    );
  }

  return res.status(400).send("Bad request!");
});

router.patch("/:id", async function (req, res, next) {
  console.log(req.params);
  console.log(req.body);
  const { title, description, images } = req.body;
  const { id } = req.params;
  return dataService.updateSingle(
    "Items",
    id,
    { title, description, images },
    (err, result) => {
      if (err) {
        next(err);
      } else {
        res.send(result);
      }
    }
  );
});

router.get("/:id", async function (req, res, next) {
  console.log(req.params);
  const { id } = req.params;
  dataService.getSingle("Items", id, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send(result);
    }
  });
});

router.delete("/:id", async function (req, res, next) {
  console.log(req.params);
  const { id } = req.params;
  return dataService.updateSingle(
    "Items",
    id,
    { is_deleted: true },
    (err, result) => {
      if (err) {
        next(err);
      } else {
        res.send(`You deleted item ${id}`);
      }
    }
  );
});

module.exports = router;
