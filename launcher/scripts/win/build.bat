SET PATH=%CD%/nodejs-win;%PATH%

cd resources/
robocopy global/ client/src/global /E /is /it
robocopy global/ server/src/global /E /is /it
yarn build:prod
