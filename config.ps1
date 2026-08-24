#replace the emsdk_env.ps1 path with your own. this is fool-proof
#also make sure all your deps are installed in emscripten's sysroot

if (Test-Path build) {Remove-Item build -Recurse}
D:\Downloads\buildscripts-master\emscripten\emsdk-portable\emsdk_env.ps1
emcmake cmake -S . -B .\build --fresh -G Ninja --preset emscripten-debug
pause