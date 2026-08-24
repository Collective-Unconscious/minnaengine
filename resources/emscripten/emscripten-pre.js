// Note: The `Module` context is already initialized as an
// empty object by emscripten even before the pre script

Object.assign(Module, {
  preRun: [onPreRun],
  postRun: [],

  print: (...args) => {
    console.log(...args);
  },

  printErr: (...args) => {
    console.error(...args);
  },

  canvas: (() => {
    const canvas = document.getElementById('canvas');

    // See http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.15.2
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
    }, false);

    canvas.addEventListener('webglcontextrestored', () => {
      Module.api.resetCanvas();
    });

    return canvas;
  })(),

  setStatus: text => {
    if (!Module.setStatus.last) Module.setStatus.last = {
      time: Date.now(),
      text: ''
    };

    if (text !== Module.setStatus.text) {
      const statusLabel = document.getElementById('status');
      if (statusLabel)
        statusLabel.innerHTML = text;
    }
  },

  totalDependencies: 0,

  monitorRunDependencies: left => {
    Module.totalDependencies = Math.max(Module.totalDependencies, left);
    Module.setStatus(left ? `Preparing... (${Module.totalDependencies - left}/${Module.totalDependencies})` : 'Downloading game data...');
  }
});

var game_pushed = false;
var lang_pushed = false;
/**
 * Parses the current location query to setup a specific game
 */
function parseArgs () {
  const items = window.location.search.substr(1).split("&");
  let result = [];

  // Store saves in subdirectory `Save`
  result.push("--save-path");
  result.push("Save");

  for (let i = 0; i < items.length; i++) {
    const tmp = items[i].split("=");

    if (tmp[0] === "project-path" || tmp[0] === "save-path") {
      // Filter arguments that are set by us
      continue;
    }

    // Filesystem is not ready when processing arguments, store path to game/language
    if (tmp[0] === "game" && tmp.length > 1) {
      Module.game = tmp[1];
      continue;
    }

    if (tmp.length > 1) {
      const arg = decodeURI(tmp[1]);
      // Split except if it's a string
      if (arg.length > 0) {
        if (arg.startsWith('"') && arg.endsWith('"')) {
          result.push(arg.slice(1, -1));
        } else {
          result = [...result, ...arg.split(" ")];
        }
      }
    }
  }

  return result;
}

function onPreRun () {
  // Retrieve save directory from persistent storage before using it
  FS.mkdir("Save");
  FS.mount(Module.saveFs, {}, 'Save');

  // For preserving the configuration. Shared across website
  FS.mkdir("/home/web_user/.config");
  FS.mount(IDBFS, {}, '/home/web_user/.config');

  FS.syncfs(true, function(err) {});
}

Module.setStatus('Downloading...');
Module.arguments = ["easyrpg-player", ...parseArgs()];

if (Module.game === undefined) {
  Module.game = "";
} else {
  Module.arguments.push("--game", Module.game);
  Module.game = Module.game.toLowerCase();
}

if (Module.language === undefined || Module.language.toLowerCase() === "default") {
  Module.language = "";
} else {
  Module.arguments.push("--language", Module.language);
}

if (Module.wsUrl === undefined) {
  Module.wsUrl = "ws://localhost:8080/";
}

// Catch all errors occuring inside the window
window.addEventListener('error', (event) => {
  // workaround chrome bug: See https://github.com/EasyRPG/Player/issues/2806
  if (event.error.message.includes("side-effect in debug-evaluate") && event.defaultPrevented) {
    return;
  }

  Module.setStatus('Exception thrown, see JavaScript console…');
  Module.setStatus = text => {
    if (text) Module.printErr(`[post-exception status] ${text}`);
  };
});

globalThis.onRequestFile = function (ptr, len) {
  const name = UTF8ToString(Number(ptr), Number(len));
  console.log("Requested file:", name);
};

globalThis.onLoadMap = function (mapName) {
  console.log("[onLoadMap]", mapName);
};

globalThis.onRoomSwitch = function () {
  console.log("[onRoomSwitch]");
};

globalThis.syncPlayerData = function (
  uuid,
  rank,
  accountBin,
  badge,
  medalsArray,
  id
) {
  console.log("[syncPlayerData]", {
    uuid,
    rank,
    accountBin,
    badge,
    medalsArray,
    id
  });
};

globalThis.onPlayerDisconnected = function (id) {
  console.log("[onPlayerDisconnected]", id);
};

globalThis.onPlayerConnectedOrUpdated = function (system, name, id) {
  console.log("[onPlayerConnectedOrUpdated]", {
    system,
    name,
    id
  });
};

globalThis.onUpdateConnectionStatus = function (status) {
  console.log("[onUpdateConnectionStatus]", status);
};

globalThis.onReceiveInputFeedback = function (state) {
  console.log("[onReceiveInputFeedback]", state);
};

globalThis.onNametagModeUpdated = function (mode) {
  console.log("[onNametagModeUpdated]", mode);
};

globalThis.onPlayerSpriteUpdated = function (spriteName, index, id) {
  console.log("[onPlayerSpriteUpdated]", {
    spriteName,
    index,
    id
  });
};

globalThis.onPlayerTeleported = function (mapId, x, y) {
  console.log("[onPlayerTeleported]", {
    mapId,
    x,
    y
  });
};

globalThis.onSaveSlotUpdated = function (x) {
  console.log("[onSaveSlotUpdated]", {
    x
  });
};

globalThis.onUpdateSystemGraphic = function (systemGraphic) {
  console.log("[onUpdateSystemGraphic]", systemGraphic);
};

globalThis.onBadgeUpdateRequested = function () {
  console.log("[onBadgeUpdateRequested]");
};

globalThis.showClientToastMessage = function (message, icon) {
  console.log("[showClientToastMessage]", {
    message,
    icon
  });
};

globalThis.shouldConnectPlayer = function (uuid) {
  console.log("[shouldConnectPlayer]", uuid);
  return true;
};
