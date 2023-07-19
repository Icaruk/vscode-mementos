"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColorFromExtraText = void 0;
const vscode_1 = require("vscode");
const getTextColorForBackground_1 = require("./getTextColorForBackground");
const semanticColors_1 = require("./semanticColors");
const stringIncludes_1 = require("../stringIncludes");
const getColorFromExtraText = (text) => {
    const config = vscode_1.workspace.getConfiguration("mementos");
    const defaultColor = config.get("gutter.defaultColor") ?? "11,11,11";
    const colors = {
        fillRgb: defaultColor,
        textRgb: "255,255,255",
    };
    for (let _colorKey in semanticColors_1.semanticColors) {
        const { rgb, wordList } = (0, semanticColors_1.getSemanticColor)(_colorKey);
        if ((0, stringIncludes_1.stringIncludes)(text, wordList)) {
            colors.fillRgb = rgb;
            break;
        }
        ;
    }
    ;
    colors.textRgb = (0, getTextColorForBackground_1.getTextColorForBackground)(colors.fillRgb);
    return colors;
};
exports.getColorFromExtraText = getColorFromExtraText;
//# sourceMappingURL=getColorFromExtraText.js.map