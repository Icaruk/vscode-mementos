"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMementoFromLine = void 0;
const vscode_1 = require("vscode");
const getMementoComponents_1 = require("./getMementoComponents");
function deleteMementoFromLine({ activeEditor, lineNumber }) {
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
    // Get text
    const text = activeEditor.document.lineAt(lineNumber).text;
    const isEmptyLine = text.trim().length === 0;
    if (isEmptyLine) {
        return;
    }
    ;
    // Find the index of the "//" text
    let commentIndex = text.lastIndexOf("//");
    const commentHasLeftSpace = commentIndex !== -1 && text[commentIndex - 1] === " ";
    if (commentHasLeftSpace) {
        commentIndex--;
    }
    ;
    const { isMemento } = (0, getMementoComponents_1.getMementoComponents)(text);
    if (!isMemento) {
        return;
    }
    ;
    // Place cursor at the end of the line
    activeEditor.selection = new vscode_1.Selection(position, position);
    const range = new vscode_1.Range(new vscode_1.Position(lineNumber, commentIndex), new vscode_1.Position(lineNumber, text.length));
    // Edit line
    activeEditor.edit(editBuilder => {
        editBuilder.delete(range);
    });
}
exports.deleteMementoFromLine = deleteMementoFromLine;
;
//# sourceMappingURL=deleteMementoFromLine.js.map