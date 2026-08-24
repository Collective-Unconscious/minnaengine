# Minnaengine

its just a fork of easyrpg player. built for emscripten, for running Collective Unconscious.

## Emscripten and Emsdk

emscripten is a framework used for this project for .wasm and .js glue (additionally .html) code generation.
using emscripten requires specialized programs, all of which are included in EM Software Development Kit and easyrpg's buildscripts repo.

you need to build every minimal dependency using emcmake (emscripten's cmake alternative) unless its already ported and available.
(ported packages are prebuilt libraries that are shipped with emsdk. they must be specified at configuration if used at all.) 

working with emscripten requires you to launch emsdk_env.sh/.ps1 from a shell. this file can be found in emsdk's directory.
when config/linking, emscripten will only look at its own sysroot directory (emsdk/upstream/emscripten/cache/sysroot/) to find library files. make sure everything is installed there. 

## Minimal Dependencies

below is a list of the dependencies needed to at least compile the program, with their availability next to them:

-expat (must rebuild)
-inih (must vendor: inih is made of a single header file so you can simply link it without a library by using cmake magic) 
-zlib (available as an ems port)
-sdl (available as an ems port)
-pixman (must rebuild)
-nlohmann_json (must rebuild)
-libpng (available as an ems port)
-fmt (must rebuild)

and most importantly:
-liblcf (must rebuild)

more packages used by the engine can be seen in the cmakelists.txt. 

## Building

if you have installed every dependency properly, compiling the program is as simple as editing several parts of the given shell files and running all.ps1.
the main build script all.ps1 is split into 4 parts:

### config.ps1
runs emcmake to create the ./build directory. you must replace the emsdk_env.ps1 path with your own here.

### unzip.ps1
this unzips the game files into ./build/games/default. replace the path to the game's .zip file with your own.
this part uses 7zip. if you dont have it you might manually unzip the game into the same directory AND run ./resources/emscripten/indexgen.py afterwards, without moving it.
for convenience, this doesnt unzip the sound archive yet.

### build.ps1 
simply builds the source files. if there is an error thrown here it is because of the source files or linker errors.

### server.ps1
runs the local host in ./build. to play the game now, you can manually type the http address of the html file into your browser. clicking the .html directly wont work.


happy coding
