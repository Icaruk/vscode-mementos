"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColorFromExtraText = void 0;
const getTextColorForBackground_1 = require("./utils/getTextColorForBackground");
const semanticColors_1 = require("./utils/semanticColors");
const stringIncludes_1 = require("./utils/stringIncludes");
const getColorFromExtraText = (text) => {
    const colors = {
        fillRgb: "11,11,11",
        textRgb: "255,255,255",
    };
    const textLower = text.toLowerCase();
    for (let _colorKey in semanticColors_1.semanticColors) {
        const { rgb, wordList } = semanticColors_1.semanticColors[_colorKey];
        if ((0, stringIncludes_1.stringIncludes)(text, wordList)) {
            colors.fillRgb = rgb;
            break;
        }
    }
    colors.textRgb = (0, getTextColorForBackground_1.getTextColorForBackground)(colors.fillRgb);
    return colors;
};
exports.getColorFromExtraText = getColorFromExtraText;
//# sourceMappingURL=getColorFromExtraText.js.map