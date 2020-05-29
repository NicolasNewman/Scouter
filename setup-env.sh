#!/bin/bash

if $(dpkg --compare-versions $(dpkg-query -f='${Version}' --show nodejs) lt 12)
then echo "NodeJS version >= 12 is missing. Please install it and then re-run this script"; 
exit 1
fi

dpkg -s yarn &> /dev/null
if [ $? -eq 1 ];
then echo "Yarn is missing. Please install it and then re-run this scrpt"; 
exit 1
fi

yarn install
cd server && yarn install && cd ..
cd client && yarn install && cd ..
cd launcher && yarn install