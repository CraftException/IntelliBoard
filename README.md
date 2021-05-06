# IntelliBoard

IntelliBoard is a Paintbrush Application, optimized for Whiteboards and Touchscreens (still needs a lot of work),
written in Node.JS, using the Express Web-Framework.

## Features

- Account System (All User Data is stored in a MongoDB Database)
- Page / Book System
- Tools:
    - Paintbrush
    - Eraser
    - Marker
    - Text
    - Images
- Background Grid
- Undo / Redo
- Extensible Pages

## To-Do

- Drag & Drop of Elements
- Other Media Types (Audio, Video)
- Downloadable Pages

## Run IntelliBoard

1. You have to have Node and NPM installed

2. Set the Server Port in the Environment Variable "PORT" 


    PORT=80

2. Clone the repository and navigate to the repository folder:
    
        git clone https://github.com/CraftException/intelliboard
        cd IntelliBoard

3. Replace the Contents of the File *backend/mongouri.txt* with your URI of your MongoDB Cluster/Server


4. Install all Dependencies:

        npm install
   
5. Build Files
    
        npm run compile-ts
   
6. Start Server

        node bin/www

5. To run the Server forever, you can start the Server with screen:

        screen -S intelliboard node bin/www

## Information for Firefox and Firefox-Based Browsers
The current version contains some bugs for Firefox and Firefox-Based Browsers (Tor-Browser...)
The following Bugs will work perfectly in Google Chrome and Chromium Based Browsers
- The Color selection in the Rich Text Editor isn't working

## License

IntelliBoard is licensed by the MIT-License

## Languages

The languages, which are currently supported in IntelliBoard, are German and English.
The Files are in the *lang* Folder, and all Languages are listed in *lang/languages.json*