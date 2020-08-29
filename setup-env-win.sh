#!/bin/bash
OP=$PATH

# if $(dpkg --compare-versions $(dpkg-query -f='${Version}' --show nodejs) lt 12)
# then echo "NodeJS version >= 12 is missing. Please install it and then re-run this script"; 
if ! node -v | grep -oq "v[1-9][2-9]"; # fix for 21 31 etc
then echo "NodeJS version >= 12 is missing. Please install it and then re-run this script"
exit 1
fi

#dpkg -s yarn &> /dev/null
#if [ $? -eq 1 ];
if ! yarn -v &> /dev/null;
then echo "Yarn is missing. Please install it and then re-run this scrpt"; 
exit 1
fi

if [ ! -d "nodejs-win/" ] 
then
    echo "nodejs-win binary does not exist. Downloading..."
    curl https://nodejs.org/dist/v12.18.3/node-v12.18.3-win-x64.zip > nodejs-win.zip
    unzip nodejs-win.zip
    rm nodejs-win.zip
    mv node-v12.18.3-win-x64 nodejs-win

    cd nodejs-win
    export PATH="$(pwd)":$OP
    npm install -g yarn
    cd ../
    export PATH=$OP
fi

yarn install
cd server && yarn install && cd ..
cd client && yarn install && cd ..
cd launcher && yarn install && cd ..