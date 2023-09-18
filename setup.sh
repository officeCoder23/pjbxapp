#!/usr/bin/env bash

mkdir -p temp
echo "Updating Apt"
apt-get update
echo "Installing Apt files"
apt-get install mongodb -y

if [ $? -ne 0 ]
then
	echo -e "MongoDB could not be installed in auto mode, Install manually!......\n"
    echo -e "\tExiting!!!!!!!!!\n"
    echo -e "\tHALT"
	exit 1
fi


apt install vim certbot php-cgi curl netcat unzip -y

echo "Install Node.js v14"

curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o temp/n
bash temp/n 14

echo "Starting DB service"

service mongodb start

echo "Installing Npm packages for main"
npm install

echo "Setting Up Daemon App Daemonize"
npm install -g pm2 forever



echo "Setting Up Environmental Files"

echo "Checking Hostname IP....."
hostIp=$(hostname -I | awk '{print $1}')
echo "Host IP is $Ip"


echo "Generating Secret....."
newSecretcat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)

siteAuth=$(openssl rand -hex 32)

echo "Generating Defaults......."
export MANAGER_USERNAME="pjb"
pm2Port=5111
hostPort=3000

echo "Finished Generating Defaults......"


echo "Setting up packages for PJBX"
cd pjb
bash setup-pjb.sh


echo "Finished installing PJBX packages"
cd -

cat > ".env" <<- EOM
HOST_IP=$hostIp

#MONGODB_URI=$MONGODB_URI

HOST_PORT=$hostPort

SITE_AUTH=$siteAuth

PM2_PORT=$pm2Port

EOM

echo "ALL IS OK."
