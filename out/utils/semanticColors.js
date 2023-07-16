"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSemanticColor = exports.semanticColors = void 0;
const vscode_1 = require("vscode");
;
;
// https://colorswall.com/es/palette/171299
exports.semanticColors = {
    red: {
        rgb: "255,105,97",
        wordList: ["err", "del", "x", "!"],
    },
    orange: {
        rgb: "255,180,128",
        wordList: ["todo", "to-do", "to_do"],
    },
    yellow: {
        rgb: "248,243,141",
        wordList: ["warn", "warning"],
    },
    blue: {
        rgb: "89,173,246",
        wordList: ["bm", "book", "mark"],
    },
    green: {
        rgb: "66,214,164",
        wordList: ["ok", "done", "ready"],
    },
    cyan: {
        rgb: "8,202,209",
        wordList: ["*"],
    },
    purple: {
        rgb: "157,148,255",
        wordList: ["*"],
    },
    pink: {
        rgb: "199,128,232",
        wordList: ["pink", ">", "<"],
    }
};
function getSemanticColor(color) {
    const wordListFromConfig = vscode_1.workspace.getConfiguration("mementos").get(`gutter.mementoTitles.${color}`);
    const semanticColor = exports.semanticColors[color];
    if (wordListFromConfig?.length) {
        semanticColor.wordList = wordListFromConfig;
    }
    ;
    return semanticColor;
}
exports.getSemanticColor = getSemanticColor;
//# sourceMappingURL=semanticColors.js.map