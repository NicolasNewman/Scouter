:: Final file structure:
:: resources/
:: ├── server/
:: │   └── package.json
:: ├── client/
:: │   └── package.json
:: ├── scripts/
:: │   ├── win/
:: │   │   └── [you are here]
:: │   └── unix/
:: └── package.json
SET PATH=%CD%\..\mongodb-win;%PATH%

mongod.exe --dbpath=%CD%\resources\mongodb\data --logpath %CD%\resources\mongodb\log --port 27017