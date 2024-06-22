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

module.exports = router;
