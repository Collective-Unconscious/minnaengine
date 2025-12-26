import os
import json

no = [".lmt", ".ldb", ".ini", ".soundfont", ".script", ".dll", ".lmu"]

def generate_index(game_root, output_file="index.json"):
    cache = {}

    for root, dirs, files in os.walk(game_root):
        for filename in files:

            abs_path = os.path.join(root, filename)
            rel_path = os.path.relpath(abs_path, game_root)
            nam , a = os.path.splitext(rel_path)
            rel_path = rel_path.replace("\\", "/")
            
            if a in no:
                cache[rel_path]= rel_path
                
            else:
                cache[nam.split("/")[-1].replace("\\", "/")]= rel_path 

    index = {
        "metadata": {
            "version": 2
        },
        "cache": cache
    }

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(index, f, indent=2, sort_keys=True)

    print(f"Generated {output_file}")


game_root = "../../build/games/default"
generate_index(game_root)
if(os.path.isfile(os.path.join(game_root, "index.json"))):
    os.remove(os.path.join(game_root, "index.json"))
f= os.rename("./index.json", os.path.join(game_root, "index.json"))
