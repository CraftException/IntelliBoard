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
import {generateRandomString, UserHelper} from "../Backend/DatabaseHelper";

// Import Password Hashing
import * as hashing from "password-hash";

// Get Router
const router = express.Router();

//Add all languages to the router
JSON.parse(fs.readFileSync("lang/languages.json", "utf-8")).forEach(lang => {

    // Login Router
    router.get(`/${lang}/login`, function (req, res, next):void {
        if (isLoggedIn(req, res)) {
            res.redirect(`/${lang}/overview`)
        } else {
            res.render('authorization/login', {
                lang: loadLanguage(lang), // Language file
                title: "login", // Title
                UpdatedPW: req.query["UpdatedPW"],
                WrongData: req.query["WrongData"],
                CreateAccount: req.query["CreateAccount"]
            });
        }
    });

    // Login Validation Router
    router.post(`/${lang}/login`, function (req, res, next):void {
        if (isLoggedIn(req, res)) {
            res.redirect(`/${lang}/overview`)
        } else {
            try {
                const username = req.body["username"]
                const password = req.body["password"]

                if (UserHelper.usernameExists(username)) {
                    console.log([username, password, UserHelper.getAccount(username).password])
                    if (hashing.verify(password, UserHelper.getAccount(username).password)) {
                        CookieAPI.setCookie(res, "credentials", JSON.stringify({username:username, password: UserHelper.getAccount(username).password}))
                        res.redirect(`/${lang}/overview`)
                      } else {
                        res.redirect(`/${lang}/login?WrongData=true`)
                    }
                } else {
                    res.redirect(`/${lang}/login?WrongData=true`)
                }
            } catch (e) {
                res.redirect(`/${lang}/login`)
            }
        }
    });

    // Register Router
    router.get(`/${lang}/register`, function (req, res, next):void {
        if (isLoggedIn(req, res)) {
            res.redirect(`/${lang}/overview`)
        } else {
            res.render('authorization/register', {
                lang: loadLanguage(lang), // Language file
                title: "register", // Title
                AlreadyExists: req.query["AlreadyExists"]
            });
        }
    });

    // Register Validation Router
    router.post(`/${lang}/register`, function (req, res, next):void {
        if (isLoggedIn(req, res)) {
            res.redirect(`/${lang}/overview`)
        } else {
            try {
                const username = req.body["username"]
                const mail = req.body["mail"]
                const password = hashing.generate(req.body["password"])
                const databaseID = generateRandomString(10);

                if (!(UserHelper.mailExists(mail) && UserHelper.usernameExists(mail))) {
                    UserHelper.createAccount({
                        databaseID: databaseID,
                        mail: mail,
                        password: password,
                        displayname: username
                    })
                    res.redirect(`/${lang}/login?CreateAccount=true`)
                } else {
                    res.redirect(`/${lang}/login?AlreadyExists=true`)
                }
            } catch (e) {
                res.redirect(`/${lang}/login`)
            }
        }
    });

})

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

module.exports = router;