// IntelliBoard - Copyright (C) 2021 Moritz Kaufmann
// A Paintbrush Application, optimized for Whiteboards and Touchscreens (still needs a lot of work),
// written in Node.JS, using the Express Web-Framework.

// Import Express and Path
import * as express from "express";
import * as path from "path";

// Session and Cookie Addons
import * as coookieparser from "cookie-parser";

// Routers
import * as boardRouter from "./routes/board";
import * as indexRouter from "./routes/index";
import * as authRouter from "./routes/authorization";
import * as overviewRouter from "./routes/overview";

// APIs
import {loadLanguage} from "./Backend/languages";
import * as bodyParser from "body-parser";

// Generate Express
var app = express();

// Setup view Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Setup express details
app.use(coookieparser())
app.use(express.json({limit: '150mb'}));
app.use(bodyParser.json({limit: '150mb'}));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  limit: '150mb',
  extended: true
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'board')));

// Add Routers
app.use(indexRouter);
app.use(boardRouter);
app.use(authRouter);
app.use(overviewRouter);

// 404 Error Page at end of the Router
app.get('*', function(req, res){
  // Send 404 Error
  var lang = req.acceptsLanguages('de', 'en');
  if (lang == "de") {
    res.render("error", {
      lang: loadLanguage("de_de"),
      errorcode: "404",
      "title": "home"
    });
  } else {
    res.render("error", {
      lang: loadLanguage("en_us"),
      errorcode: "404",
      "title": "home"
    });
  }
});

module.exports = app;