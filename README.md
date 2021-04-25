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


2. Clone the repository and navigate to the repository folder:
    
        git clone https://github.com/CraftException/intelliboard
        cd IntelliBoard

3. Replace the Contents of the File *backend/mongouri.txt* with your URI of your MongoDB Cluster/Server


4. Install all Dependencies and Start the Server:

        npm install
        node bin/www

5. To run the Server forever, you can start the Server with screen:

        screen -S intelliboard node bin/www

## License

IntelliBoard is licensed by the MIT-License

## Languages

The languages, which are currently supported in IntelliBoard, are German and English.
The Files are in the *lang* Folder, and all Languages are listed in *lang/languages.json*