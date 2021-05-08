# IntelliBoard - Copyright (C) 2021 Moritz Kaufmann
# Stop Script for IntelliBoard
echo "Stopping IntelliBoard"
screen -X -S intelliboard kill
echo "IntelliBoard has stopped!"