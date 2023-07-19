"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertMementoIntoLine = void 0;
const vscode_1 = require("vscode");
function insertMementoIntoLine({ activeEditor, lineNumber }) {
    if (!activeEditor) {
        return;
    }
    ;
    // Get cursor position
    const position = activeEditor.selection.active;
    if (!lineNumber) {
        lineNumber = position.line;
    }
    ;
    // Get line text under cursor
    const text = activeEditor.document.lineAt(lineNumber).text;
    const isEmptyLine = text.trim().length === 0;
    const config = vscode_1.workspace.getConfiguration("mementos");
    const triggerWord = config.get("comment.triggerWord");
    const separator = config.get("comment.triggerWordSeparator");
    if (isEmptyLine) {
        activeEditor.edit(editBuilder => {
            if (activeEditor) {
                editBuilder.insert(activeEditor.selection.active, `// ${triggerWord}${separator}`);
            }
            ;
        });
    }
    else {
        // Place cursor at the end of the line
        activeEditor.selection = new vscode_1.Selection(position, position);
        const lastPosition = new vscode_1.Position(lineNumber, text.length);
        // Edit line
        activeEditor.edit(editBuilder => {
            editBuilder.insert(lastPosition, ` // ${triggerWord}${separator}`);
        });
    }
}
exports.insertMementoIntoLine = insertMementoIntoLine;
;
//# sourceMappingURL=insertMementoIntoLine.js.map