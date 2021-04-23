// Import Express and Path
import * as express from "express";
import * as path from "path";

// Session and Cookie Addons
import * as session from "express-session";

// Routers
import * as indexRouter from "./routes/index";

// Generate Express
var app = express();

// Setup view Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Setup express details
app.use(session({secret: 'intelliboard-session-storage',saveUninitialized: true,resave: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'Board')));

// Add Routers
app.use(indexRouter);

// 404 Error Page at end of the Router
app.get('*', function(req, res){
  // Send 404 Error
  res.status(404).send('what???');
});

module.exports = app;