const express = require("express");
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('about', {
    title: "About",
    authors: ["AMINE EL Mehdi", "Khaled Hamrani", "Aboubakar-Siriki Diakite"],
    version: "0.0.1"
  });
});

module.exports = router;
