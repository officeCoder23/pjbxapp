echo "Rebooting/Updating PJBX instance"

sleep 3

echo "Stopping Services that may conflict"
service apache2 stop

service nginx stop

npm run stop

echo "Updating PJBX to the latest"

git checkout master
git pull origin master

if [ $? -ne 0 ]
then
    echo "Error: Failed to update PJBX"
    exit 1
fi

echo "Starting PJBX"
npm run start

echo "Update/Reboot done successfully..."
