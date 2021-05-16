// IntelliBoard - Copyright (C) 2021 Moritz Kaufmann
// Cookie API

// Import Cookie Parser
import * as coookieparser from "cookie-parser";

// API for Cookie Handling
export module CookieAPI {

    // Set a cookie
    export function setCookie (res, key:string, value:string) {
        res.cookie(key, value, { maxAge: 90000000000, httpOnly: true });
    }

    // Does a cookie exists?
    export function cookieExists(req, key:string):boolean {
        const value = req.cookies[key]
        return value == null || value == undefined || value == ""
    }

    // Get a cookie
    export function getCookies(req, key:string):string {
        return req.cookies[key];
    }

}