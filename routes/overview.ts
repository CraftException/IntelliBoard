// IntelliBoard - Copyright (C) 2021 Moritz Kaufmann
// Authorization Router

// Import Express
import * as express from "express";

// Import File-System
import * as fs from "fs";

// Import Language Backend
import {loadLanguage} from "../Backend/languages";

// Import APIs
import {CookieAPI} from "../Backend/CookieAPI";
import {ContentHelper, generateRandomString, UserHelper} from "../Backend/DatabaseHelper";

// Import Password Hashing
import * as hashing from "password-hash";

// Get Router
const router = express.Router();

//Add all languages to the router
JSON.parse(fs.readFileSync("lang/languages.json", "utf-8")).forEach(lang => {

    // Login Router
    router.get(`/${lang}/overview`, function (req, res, next): void {
        if (isLoggedIn(req, res)) {
            res.render('overview', {
                lang: loadLanguage(lang), // Language file
                title: "overview", // Title
                page: req.query["page"] || "my_books",
                displayname: req.query["displayname"],
                contents: JSON.parse(ContentHelper.getDatabase(getDatabaseID(req, res)))
            });
        } else {
            res.redirect(`/${lang}/login`)
        }
    });

});

// Get if logged in
export function isLoggedIn (req, res):boolean {
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