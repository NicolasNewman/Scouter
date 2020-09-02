SET PATH=%CD%\resources\mongodb;%PATH%

mongod.exe --dbpath=%CD%\resources\mongodb\data --logpath %CD%\resources\mongodb\log\log.log --port 27017