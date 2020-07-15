:: Final file structure:
:: resources/
:: ├── server/
:: │   └── package.json
:: ├── client/
:: │   └── package.json
:: ├── scripts/
:: │   ├── win/
:: │   └── unix/
:: │       └── [you are here]
:: └── package.json

cd resources/
robocopy global/ client/src/global /E /is /it
robocopy global/ server/src/global /E /is /it
yarn build:prod
