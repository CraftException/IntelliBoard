// Import Express
import * as express from "express";

// Import File-System
import * as fs from "fs";

// Import Language Backend
import {loadLanguage} from "../Backend/languages";

// Get Router
const router = express.Router();

// Add all languages to Router
JSON.parse(fs.readFileSync("lang/languages.json", "utf-8")).forEach(lang => {
  // Add Lang Router
  router.get(`/${lang}/board`, function (req, res, next):void {
    // Render template in views/board.ejs
    res.render('board', {
      lang: loadLanguage(lang), // Language file
      colors: JSON.parse(fs.readFileSync("Backend/colors.json", "utf-8")), // Color File
      toolbar: JSON.parse(fs.readFileSync("./Backend/toolbar.json", "utf-8")), // Toolbar File
      title: "board" // Title
    });
  });
})

module.exports = router;