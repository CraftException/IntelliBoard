# IntelliBoard - Copyright (C) 2021 Moritz Kaufmann
# Start Script for IntelliBoard
echo "Starting IntelliBoard"
screen -dm -S intelliboard node bin/www
echo "IntelliBoard has started!"