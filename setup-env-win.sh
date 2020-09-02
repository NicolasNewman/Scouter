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
    # use local NPM
    export PATH="$(pwd)":$OP
    echo "installing yarn..."
    npm install -g yarn
    cd ../
    # revert back to global
    export PATH=$OP
fi

if [ ! -d "mongodb/" ]
then
    echo "mongodb binary does not exist. Downloading..."
    curl https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-4.4.0.zip > mongodb-win.zip
    unzip mongodb-win.zip 'mongodb-win32-x86_64-windows-4.4.0/bin/*' -d mongodb-win
    mv mongodb-win/mongodb-win32-x86_64-windows-4.4.0/bin/* mongodb-win/
    rm -rf mongodb-win/mongodb-win32-x86_64-windows-4.4.0
    rm mongodb-win/Install-Compass.ps1
    rm mongodb-win.zip
    mkdir mongodb-win/data
    mkdir mongodb-win/log

    echo "copying needed MS VSC C++ binaries"
    cp C:\\Windows\\System32\\msvcp140.dll mongodb-win/
    cp C:\\Windows\\System32\\vcruntime140.dll mongodb-win/
    cp C:\\Windows\\System32\\vcruntime140_1.dll mongodb-win/
fi

yarn install
cd server && yarn install && cd ..
cd client && yarn install && cd ..
cd launcher && yarn install && cd ..