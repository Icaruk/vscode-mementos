"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringIncludes = void 0;
function stringIncludes(text, words) {
    if (!text) {
        return false;
    }
    ;
    for (const _word of words) {
        if (text.toLowerCase().includes(_word)) {
            return true;
        }
    }
    return false;
}
exports.stringIncludes = stringIncludes;
//# sourceMappingURL=stringIncludes.js.map