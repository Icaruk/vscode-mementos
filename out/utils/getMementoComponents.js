"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMementoComponents = void 0;
const vscode_1 = require("vscode");
function getMementoComponents(text) {
    // Get config "mementos.comment.triggerWord"
    const config = vscode_1.workspace.getConfiguration("mementos");
    const triggerWordConfig = config.get("comment.triggerWord");
    const separatorConfig = config.get("comment.triggerWordSeparator");
    // Check regex if line includes --> // triggerWord:title description
    const regex = new RegExp(`\/\/ {0,}(${triggerWordConfig})${separatorConfig}([^ ]*)\s?(.*)`, "gm");
    const match = regex.exec(text);
    const triggerWord = match?.[1] ?? "";
    const title = match?.[2] ?? "";
    const description = match?.[3] ?? "";
    return {
        isMemento: triggerWord === triggerWordConfig,
        triggerWord,
        title,
        description,
    };
}
exports.getMementoComponents = getMementoComponents;
//# sourceMappingURL=getMementoComponents.js.map