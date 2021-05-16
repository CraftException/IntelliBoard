// IntelliBoard - Copyright (C) 2021 Moritz Kaufmann
// Board Router

// Import Express
import * as express from "express";

// Import File-System
import * as fs from "fs";

// Import Language Backend
import {loadLanguage} from "../Backend/languages";

// Import Cookie API
import {CookieAPI} from "../Backend/CookieAPI";
import {ContentHelper, UserHelper} from "../Backend/DatabaseHelper";

// Get Router
const router = express.Router();

// Add all languages to Router
JSON.parse(fs.readFileSync("lang/languages.json", "utf-8")).forEach(lang => {
  // Add Lang Router
  router.get(`/${lang}/board`, function (req, res, next):void {
    // Render template in views/board.ejs
    res.render('board', {
      lang: loadLanguage(lang), // Language file
      toolbar: JSON.parse(fs.readFileSync("./Backend/toolbar.json", "utf-8")), // Toolbar File
      title: "board", // Title
      contents: ContentHelper.getDatabase(getDatabaseID(req, res)), // Contents
      pageid: req.query["id"],
      book: req.query["book"]
    });
  });
})

// Router to update Database
router.post(`/update`, function (req, res, next): void {
  res.setHeader('content-type', 'text/plain');

  if (isLoggedIn(req, res)) {
    if (req.body["newcontent"]) {
      ContentHelper.updateDatabase(getDatabaseID(req, res), req.body["newcontent"]);
      res.write("200 OK");
    } else {
      res.status(500).write("500 Server Error");
    }
  } else {
    res.status(403).write("302 Not authorized.");
  }
  res.end();
});

// Get if logged in
function isLoggedIn (req, res):boolean {
  // Check if credentials Cookie is given
  if (!CookieAPI.getCookies(req, "credentials")) {
    return;
  }

  // Get Cookies
  const username = JSON.parse(CookieAPI.getCookies(req, "credentials"))["username"]
  const password = JSON.parse(CookieAPI.getCookies(req, "credentials"))["password"]

  // Do next step, if cookies are defined
  if (username != undefined && password != undefined) {
    // Get Account
    const user = UserHelper.getAccount(username)

    if (!user)
      return;

    // Check if password is correct
    return password == user.password
  }

  // Fallback false
  return false;
}


// Get Username
export function getDatabaseID(req, res):string {
  // Check if credentials Cookie is given
  if (!CookieAPI.getCookies(req, "credentials")) {
    return "null";
  }

  // Get Cookies
  const username = JSON.parse(CookieAPI.getCookies(req, "credentials"))["username"];
  const password = JSON.parse(CookieAPI.getCookies(req, "credentials"))["password"];

  // Do next step, if cookies are defined
  if (username != undefined && password != undefined) {
    // Get Account
    const user = UserHelper.getAccount(username);

    if (!user)
      return;

    // Check if password is correct
    return user.databaseID;
  }

  // Fallback false
  return "null";
}

module.exports = router;