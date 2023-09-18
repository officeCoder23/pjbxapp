echo "Activating license for help. Check Telegram: @blaqpageX"

if [ $# -eq 0 ]; then
  read -p "Enter License key: " license
else
  license=$1
fi

cd PJBX

./PJBX.app activate $license
