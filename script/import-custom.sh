echo "Importing Custom page"

if [ $# -eq 0 ]
  then
    read -p "Enter the download url: " downloadUrl
  else
    downloadUrl=$1
fi

echo "..........."

read -p "Enter the custom project name: " customName

cd PJBX/projects/

rm -rf "$customName"

rm -rf apppx0

wget $downloadUrl -O appx0.zip

unzip -o appx0.zip

rm -rf appx0.zip

cd ../..

echo "chillllllll we digging......Restart your machine"

npm run restart

exit 0;
