# IntelliBoard - Copyright (C) 2021 Moritz Kaufmann
# Install Script for IntelliBoard
echo "IntelliBoard Installer v0.0.1"
echo "Install prerequisites..."

# Install git to download IntelliBoard
sudo apt install git

# Install Screen
sudo apt install screen

# Install Node and npm for prerequisites
sudo apt install nodejs npm

# Download IntelliBoard
clear
echo "Download IntelliBoard..."

git clone https://github.com/CraftException/IntelliBoard intelliboard
cd intelliboard
clear

# Set Mongo Input
echo "Input your MongoDB URI: "
read Uri

cat /dev/null > Backend/mongouri.txt

cat >> Backend/mongouri.txt <<EOF
$Uri
EOF

# Port Info
export PORT=3000
echo "Set the default port to 3000. To update the port, type 'export PORT=<port>'"

# Install and Compile typescript
echo "Build Files..."
sudo npm install
sudo npm install -g typescript
sudo npm run compile-ts

# Make shell scripts executable
chmod +x start.sh
chmod +x stop.sh 

# Start IntelliBoard
clear
echo "IntelliBoard is now installed. It'll start now."
echo "To stop IntelliBoard, type './stop.sh'"
echo "To start IntelliBoard again, type './start.sh'"
echo "----------------------------------------------"
sudo ./start.sh
