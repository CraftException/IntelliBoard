// IntelliBoard - Copyright (C) 2021 Moritz Kaufmann
// Intelliboard Bootstrap

// Import Express
import * as express from "express";

// Import File-System
import * as fs from "fs";

// Import Language Backend
import {loadLanguage} from "../Backend/languages";

// Get Router
const router = express.Router();

// Get Browser Language by Request
function getLanguage(req):string {
    var lang = req.acceptsLanguages('de', 'en');
    if (lang == "de") {
        return "de_de";
    } else {
        return "en_us";
    }
}

router.get(`/`, function (req, res, next):void {
    res.redirect("/" + getLanguage(req));
});

// Add all languages to Router
JSON.parse(fs.readFileSync("lang/languages.json", "utf-8")).forEach(lang => {
    // Add Lang Router
    router.get(`/${lang}/`, function (req, res, next):void {
        res.redirect(`/${lang}/login`);
    });
})


module.exports = router;