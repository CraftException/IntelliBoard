# IntelliBoard
IntelliBoard is a Paintbrush Application, optimized for Whiteboards and Touchscreens. It is written in JavaScript, using Node.js and Express.js, so it's a fully web-based App. All Data is stored in a MongoDB Database. You can install MongoDB on your server, or you can get a free Cluster in the MongoDB Atlas.

# Contents in this Readme
- Features
- To-Do / Known-Bugs
- Try IntelliBoard
- Build and Run IntelliBoard
- Information for Firefox Users
- Languages
- Some Impressions for IntelliBoard
- License

## Features

- Account System
- Books and Pages for each User
- Modern and simple UI
- Tools:
    - Paintbrush
    - Eraser
    - Marker
    - Text
    - Images
    - Rectangles
    - Lines
- Background Grid  for Math Things
- Undo / Redo

## To-Do

- Create Drag & Drop of Elements
- Add Image and Media (Audio, Video) Tool
- Make pages downloadable
- Add Undo / Redo Functions
- Implement Password Recovery Function with E-Mail

## Try IntelliBoard

You may test IntelliBoard with all of it's features [here.](https://intelliboard.craftexception.de)
You can create your own Account, or use this credentials:
-Email: test@intelliboard.com
-Password: ib-sandbox

## Build and Run IntelliBoard

1. Download the Install Script from this repository:

       wget https://raw.githubusercontent.com/CraftException/IntelliBoard/master/install.sh	   
2. Make the Script executable and run it:

       chmod +x install.sh	
       sudo ./install.sh
3. The script will automatically download all required things. At some point, you have to type your MongoDB Credentials.

To stop the Server go into the _intelliboard_ Folder and type _./stop.sh_
To start the Server again type _./start.sh_

## Information for Firefox Users
The current version contains some bugs for Firefox and Firefox-Based Browsers (Tor-Browser...)  
The following Bugs will work perfectly in Google Chrome and Chromium Based Browsers:
- The Color selection in the Rich Text Editor isn't working

## Languages

The languages, which are currently supported in IntelliBoard, are German and English.  
The Files are in the *lang* Folder, and all Languages are listed in *lang/languages.json*.
You can create other languages and create a Pull Request. I will merge them as fast as possible.

## Tutorial

<center><table>
    <tr>
        <td>
            <img width="364px" height="216px" src="https://craftexception.de/intelliboard_icons/1.jpg">
        </td>
        <td>
            This is the main Page of IntelliBoard,<br>
            with the background Grid enabled.<br>
            On the Top you can see the headerbar<br> 
            and on the bottom the toolbar
        </td>
    </tr>
    <tr>
        <td>
            <img src="https://craftexception.de/intelliboard_icons/2.jpg">
        </td>
        <td>
            This is the headerbar<br> on top of the board.<br><br>
            Here you can choose the<br> color, the size and some other things.
        </td>
    </tr>
    <tr>
        <td>
            <img src="https://craftexception.de/intelliboard_icons/3.jpg">
        </td>
        <td>
            With the Toolbar on the bottom<br>
            of the board, you can switch between<br>
            all tools (see Tools).
        </td>
    </tr>
    <tr>
        <td>
            <img src="https://craftexception.de/intelliboard_icons/4.jpg">
        </td>
        <td>
            If you hover over the vector tool,<br>
            a popup opens, where you can <br> switch
            between lines and rectangles.
        </td>
    </tr>
    <tr>
        <td>
            <img width="165px" height="206px" src="https://craftexception.de/intelliboard_icons/5.jpg">
            <img width="165px" height="206px" src="https://craftexception.de/intelliboard_icons/6.jpg">
        </td>
        <td>
            This is the Rich Text Editor. <br>
            You can switch between the colors. <br>
            Also, you can format the Text <br>
            and change the text size.
        </td>
    </tr> 
    <tr>
        <td>
            <img width="334px" height="282px" src="https://craftexception.de/intelliboard_icons/7.jpg">
        </td>
        <td>
            Here, you can see the login form. <br>
            The register form looks very similiar to the login form.
        </td>
    </tr>
</table></center>

## License

IntelliBoard is licensed by the MIT-License  