/*
 * This file is part of EasyRPG Player.
 *
 * EasyRPG Player is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * EasyRPG Player is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EasyRPG Player. If not, see <http://www.gnu.org/licenses/>.
 */

// Headers
#include <sstream>
#include "filefinder.h"
#include "output.h"
#include "player.h"
#include "scene_load.h"
#include "scene_map.h"
#include "platform/emscripten/interface.h"

Scene_Load::Scene_Load() :
	Scene_File(ToString(lcf::Data::terms.load_game_message)) {
	Scene::type = Scene::Load;
}

void Scene_Load::Action(int index, ActionType act) {

	if (act == ActionType::LoadLocal) {
		Emscripten_Interface::UploadSavegame(index+1);
	}
	else if(act == ActionType::LoadCache) {
		bool esd = false;
		std::string save_name = fs.FindFile(fmt::format("Save{:02d}.lsd", index + 1));
		if (save_name.empty()) { save_name = fs.FindFile(fmt::format("Save{:02d}.esd", index + 1)); esd = true; }
		Player::LoadSavegame(save_name, index + 1, esd);
	}
}

bool Scene_Load::IsSlotValid(int index) {
	return file_windows[index]->IsValid();
}
