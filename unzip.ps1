#insert CU zip path below
$CU_PATH= "D:\Downloads\CU_0_4_4.zip"

$CU_VER= (Get-Item $CU_PATH).BaseName
if(Test-Path ./build/games/default) {rm ./build/games/default -Recurse}
mkdir ./build/games/default
cd ./build/games/default
7z x $CU_PATH $CU_VER/* -y
cd ./$CU_VER
Move-Item ./* -Destination ..
cd ..
rm ./$CU_VER
cd ../../../resources/emscripten
python .\indexgen.py
pause