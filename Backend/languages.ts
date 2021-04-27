// IntelliBoard - Copyright (C) 2021 Moritz Kaufmann
// Language Loader

// Import File Syytem
import * as fs from "fs";

// Load a language from lang /param-lang.json
export function loadLanguage(lang:string):object {
    return JSON.parse(fs.readFileSync(`./lang/${lang}.json`, 'utf-8'));
}