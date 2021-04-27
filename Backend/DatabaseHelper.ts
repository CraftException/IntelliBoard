// IntelliBoard - Copyright (C) 2021 Moritz Kaufmann
// Databasehelper for MongoDB Connections

// Import File System
import * as fs from "fs";

// Import MongoDB
import * as mongodb from "mongodb";

// Import DeASync
import * as deasync from "deasync";

// The MongoDB File
const mongouri = fs.readFileSync("Backend/mongouri.txt", "utf-8");

// MongoDB Details
const database = "test";

// API for User Management
export module UserHelper {

    // User Model
    export interface User {
        displayname:string,
        mail:string,
        password:string,
        databaseID:string
    }

    // Check if a mail exists
    export function mailExists(mail:string):boolean {
        return DatabaseHelper.selectData(database, "User", {mail:mail}, {}).length > 0
    }

    // Check if a username Exists
    export function usernameExists(displayname:string):boolean {
        return DatabaseHelper.selectData(database, "User", {displayname:displayname}, {}).length > 0
    }

    // Get an account
    export function getAccount(name):User {
        return DatabaseHelper.selectData(database, "User", {displayname:name}, {})[0]
    }

    // Create an Account
    export function createAccount(user:User) {
        DatabaseHelper.insertData(database, "User", user)
    }

    // Update Username
    export function updateUsername(oldDisplayName:string, newDisplayName:string) {
        DatabaseHelper.updateData(database, "User", {displayname:oldDisplayName}, {"$set":{displayname:newDisplayName}})
    }

    // Update Password
    export function updatePassword(displayName:string, password:string) {
        DatabaseHelper.updateData(database, "User", {displayname:displayName}, {"$set":{password:password}})
    }

    // Upload a Password with a mail parameter
    export function updatePasswordByMail(mail:string, password:string) {
        DatabaseHelper.updateData(database, "User", {mail:mail}, {"$set":{password:password}})
    }

}

// API for password Recovery
export module RecoveryHelper {

    // Create a Token
    export function createToken (mail:string) {
        const token = generateRandomString(10);
        DatabaseHelper.insertData(database, "Recovery", {
            mail: mail,
            token: token
        })
    }

    // Check if a token exists
    export function tokenExists (token:string):boolean {
        return DatabaseHelper.selectData(database, "Recovery", {token: token}, {}).length > 0
    }

    // Get the email by a Token
    export function getEmail(token:string):string {
        return DatabaseHelper.selectData(database, "Recovery", {token: token}, {})[0].mail
    }

}

// API for Database Management
export module DatabaseHelper {

}

// Database API for global MongoDB Connections
export module DatabaseHelper {

    // Select Data from a database
    export function selectData(db_name:string, collection:string, query, sort) {
        // Generate Result
        let result = null

        // Connect to DB
        mongodb.MongoClient.connect(mongouri, function(err, db) {
            if (err) throw err;

            // Get Database
            var dbo = db.db(db_name);

            // Get Collection and query Data
            dbo.collection(collection).find(query).sort(sort).toArray(function(err, data) {
                if (err) throw err;
                // Set Data
                result = data

                // Close Database
                db.close();
            });

        });

        // Return list, when content is loaded
        while((result == null)) { deasync.runLoopOnce(); }
        return result
    }

    // Update Data from a database
    export function updateData(db_name:string, collection:string, query, newValues) {
        // Connect to DB
        mongodb.MongoClient.connect(mongouri, function(err, db) {
            if (err) throw err;

            // Get DB
            var dbo = db.db(db_name);

            // Update Data
            dbo.collection(collection).updateOne(query, newValues, function(err, res) {
                if (err) throw err;

                // Close Database
                db.close();
            });

        });
    }

    // Delete Data from a database
    export function deleteData(db_name:string, collection:string, query) {
        // Connect to DB
        mongodb.MongoClient.connect(mongouri, function(err, db) {
            if (err) throw err;

            // Get DB
            var dbo = db.db(db_name);

            // Delete Data
            dbo.collection(collection).deleteOne(query, function(err, obj) {
                if (err) throw err;

                // Close Database
                db.close();
            });

        });
    }

    // Insert Data into a database
    export function insertData(db_name:string, collection:string, data) {
        // Connect to DB
        mongodb.MongoClient.connect(mongouri, function(err, db) {
            if (err) throw err;
            // Get DB
            var dbo = db.db(db_name);
            var dbo = db.db(db_name);

            // Insert Data
            dbo.collection(collection).insertOne(data, function(err, res) {
                if (err) throw err;
                db.close();
            });

        });
    }

}

// Generates a random string with a specific length
export function generateRandomString (length:number):string {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for ( var i = 0; i < length; i++ ) {

        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }

    return result.join('');
}