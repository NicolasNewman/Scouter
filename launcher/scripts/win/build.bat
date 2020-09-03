SET PATH=%CD%/resources/nodejs;%PATH%

cd resources/
robocopy global/ client/src/global /E /is /it /NJH /NJS /nc /ns
robocopy global/ server/src/global /E /is /it /NJH /NJS /nc /ns
yarn build:prod

REM /NFL : No File List - don't log file names.
REM /NDL : No Directory List - don't log directory names.
REM /NJH : No Job Header.
REM /NJS : No Job Summary.
REM /NP  : No Progress - don't display percentage copied.
REM /NS  : No Size - don't log file sizes.
REM /NC  : No Class - don't log file classes.